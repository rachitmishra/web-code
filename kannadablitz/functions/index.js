const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Triggered when a user document is updated.
 * Checks for changes in the 'nudges' field and sends a notification.
 */
exports.sendNudgeNotificationV2 = onDocumentUpdated("users/{userId}", async (event) => {
    const newData = event.data.after.data();
    const previousData = event.data.before.data();

    // Check if nudges field exists and has changed
    if (!newData.nudges || JSON.stringify(newData.nudges) === JSON.stringify(previousData.nudges)) {
      return null;
    }

    // Identify the new nudge sender(s)
    const oldNudges = previousData.nudges || {};
    const newNudges = newData.nudges;
    
    // Find keys in newNudges that are new or updated timestamps
    const senders = Object.keys(newNudges).filter(uid => !oldNudges[uid] || oldNudges[uid] !== newNudges[uid]);

    if (senders.length === 0) return null;

    const fcmTokens = newData.fcmTokens;
    if (!fcmTokens || fcmTokens.length === 0) {
        console.log("No FCM tokens for user", event.params.userId);
        return null;
    }

    // Construct notification payloads
    const notifications = await Promise.all(senders.map(async (senderUid) => {
        // Fetch sender's name
        const senderDoc = await admin.firestore().collection("users").doc(senderUid).get();
        const senderName = senderDoc.exists ? (senderDoc.data().userName || "A friend") : "A friend";
        
        return {
            notification: {
                title: "Nudge Alert! ⚡",
                body: `${senderName} nudged you to practice Kannada!`,
            },
            tokens: fcmTokens // Send to all user's devices
        };
    }));

    // Send notifications
    const promises = notifications.map(payload => admin.messaging().sendEachForMulticast(payload));
    return Promise.all(promises);
});

/**
 * Scheduled Daily Reminder.
 * Runs every day at 09:00 UTC.
 * Sends a reminder to users who haven't played today.
 */
exports.scheduledDailyReminderV2 = onSchedule('every day 09:00', async (event) => {
    const snapshot = await admin.firestore().collection("users").get();
    
    const promises = [];
    const today = new Date();
    
    snapshot.forEach(doc => {
        const data = doc.data();
        if (!data.fcmTokens || data.fcmTokens.length === 0) return;
        
        // Check if played today
        let playedToday = false;
        if (data.lastPlayedDate) {
            const lastPlayed = new Date(data.lastPlayedDate);
            playedToday = lastPlayed.getUTCDate() === today.getUTCDate() && 
                          lastPlayed.getUTCMonth() === today.getUTCMonth() &&
                          lastPlayed.getUTCFullYear() === today.getUTCFullYear();
        }
        
        if (!playedToday) {
            const message = {
                notification: {
                    title: "KannadaBlitz Daily 📅",
                    body: "Keep your streak alive! 5 minutes of practice today?",
                },
                tokens: data.fcmTokens
            };
            promises.push(admin.messaging().sendEachForMulticast(message));
        }
    });
    
    return Promise.all(promises);
});
