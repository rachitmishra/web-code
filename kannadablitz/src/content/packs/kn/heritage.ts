import type { HeritageEntry, NewsFeedSpec } from "../../schema";
import { KN_HERITAGE_MORE } from "./heritage_more";

const KN_HERITAGE_CORE: HeritageEntry[] = [
  // ───────────────── STORIES (4) ─────────────────
  {
    id: "kn.her.kuvempu",
    category: "stories",
    region: "Kuppalli · Malnad",
    title: "Kuvempu & the Spirit of Malnad",
    titleScript: "ಕುವೆಂಪು ಮತ್ತು ಮಲೆನಾಡು",
    titleRoman: "kuvempu mattu malenaaDu",
    summary: "How the misty forests of Shivamogga shaped Karnataka's greatest modern poet and the idea of Vishwamanava.",
    story:
      "Raised in the red-tiled Kavimane house of Kuppalli, Kuppali Venkatappa Puttappa (Kuvempu) turned the rain-soaked hills of Malnad into timeless Kannada literature and championed Vishwamanava — the universal human.",
    keyTerm: { script: "ವಿಶ್ವಮಾನವ", roman: "vishvamaanava", meaning: "Universal human being" },
    paragraphs: [
      {
        script: "ಶಿವಮೊಗ್ಗ ಜಿಲ್ಲೆಯ ಕುಪ್ಪಳ್ಳಿ ಎಂಬ ಸುಂದರ ಹಳ್ಳಿಯಲ್ಲಿ ಕುವೆಂಪು ಬೆಳೆದರು. ಅಲ್ಲಿನ ಹಸಿರು ಕಾಡು, ಮಳೆ ಮತ್ತು ಬೆಟ್ಟಗಳು ಅವರ ಮನಸ್ಸಿಗೆ ದೊಡ್ಡ ಸ್ಫೂರ್ತಿ ನೀಡಿದವು.",
        roman: "shivamogga jilleya kuppaLLi emba sundara haLLiyalli kuvempu beLedaru. allina hasiru kaaDu, maLe mattu beTTagaLu avara manassige doDDa sphuurti niiDidavu.",
        meaning: "Kuvempu grew up in the beautiful village of Kuppalli in Shivamogga district. The green forests, rain, and hills there gave great inspiration to his mind.",
      },
      {
        script: "ಅವರ ಪೂರ್ಣ ಹೆಸರು ಕುಪ್ಪಳ್ಳಿ ವೆಂಕಟಪ್ಪ ಪುಟ್ಟಪ್ಪ. ಅವರು ಕನ್ನಡದ ಮೊದಲ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ವಿಜೇತರು.",
        roman: "avara puurNa hesaru kuppaLLi venkaTappa puTTappa. avaru kannaDada modala jnaanapiiTha prashasti vijeetaru.",
        meaning: "His full name was Kuppalli Venkatappa Puttappa. He was the first Kannada writer to win the Jnanpith Award.",
      },
      {
        script: "ಅವರು ಕರ್ನಾಟಕದ ನಾಡಗೀತೆ 'ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ' ಬರೆದರು. 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು' ಅವರ ಪ್ರಸಿದ್ಧ ಕಾದಂಬರಿ.",
        roman: "avaru karnaaTakada naaDagiite 'jaya bhaarata jananiya tanujaate' baredaru. 'malegaLalli madumagaLu' avara prasiddha kaadambari.",
        meaning: "He wrote Karnataka's state anthem 'Jaya Bharata Jananiya Tanujate'. 'Malegalalli Madumagalu' (Bride in the Hills) is his famous novel.",
      },
      {
        script: "ಪ್ರತಿಯೊಂದು ಮಗುವೂ ಹುಟ್ಟುವಾಗ ವಿಶ್ವಮಾನವನಾಗಿ ಹುಟ್ಟುತ್ತದೆ ಎಂದು ಕುವೆಂಪು ಹೇಳಿದರು. ಇಂದಿಗೂ ಕುಪ್ಪಳ್ಳಿಯ ಕವಿಮನೆ ಎಲ್ಲರನ್ನು ಸ್ವಾಗತಿಸುತ್ತದೆ.",
        roman: "pratiyondu maguvuu huTTuvaaga vishvamaanavanaagi huTTuttade endu kuvempu heeLidaru. indiguu kuppaLLiya kavimane ellarannu svaagatisuttade.",
        meaning: "Kuvempu said that every child is born as a universal human being. Even today, the Kavimane house in Kuppalli welcomes everyone.",
      },
    ],
    glossary: [
      { script: "ಹಳ್ಳಿ", roman: "haLLi", meaning: "Village" },
      { script: "ಕಾಡು", roman: "kaaDu", meaning: "Forest" },
      { script: "ಮಳೆ", roman: "maLe", meaning: "Rain" },
      { script: "ಕವಿ", roman: "kavi", meaning: "Poet" },
      { script: "ವಿಶ್ವಮಾನವ", roman: "vishvamaanava", meaning: "Universal human" },
    ],
    references: [
      "Novel: Malegalalli Madumagalu (Bride in the Hills)",
      "Anthem: Jaya Bharata Jananiya Tanujate",
      "Visit: Kavimane Heritage Museum, Kuppalli",
    ],
    postcardArt: "kuppalli",
  },
  {
    id: "kn.her.hampi",
    category: "stories",
    region: "Hampi · Vijayanagara",
    title: "The Musical Pillars of Hampi",
    titleScript: "ಹಂಪಿಯ ಸಂಗೀತ ಕಂಬಗಳು",
    titleRoman: "hampiya sangiita kambagaLu",
    summary: "Granite columns that sing the seven notes of Indian classical music inside the 16th-century Vittala Temple.",
    story:
      "At the heart of the Vijayanagara Empire's boulder-strewn capital stands the Vittala Temple, famed for its Stone Chariot and 56 carved granite Saregama pillars that resonate with musical notes.",
    keyTerm: { script: "ಕಲ್ಲಿನ ರಥ", roman: "kallina ratha", meaning: "The Stone Chariot" },
    paragraphs: [
      {
        script: "ತುಂಗಭದ್ರಾ ನದಿಯ ದಡದಲ್ಲಿ ಹಂಪಿ ಎಂಬ ಪ್ರಾಚೀನ ನಗರ ಇದೆ. ಹಿಂದೆ ಇದು ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ವೈಭವದ ರಾಜಧಾನಿಯಾಗಿತ್ತು.",
        roman: "tungabhadraa nadiya daDadalli hampi emba praachiina nagara ide. hinde idu vijayanagara saamraajyada vaibhavada raajadhaaniyaagittu.",
        meaning: "On the banks of the Tungabhadra river stands the ancient city of Hampi. Long ago, it was the splendid capital of the Vijayanagara Empire.",
      },
      {
        script: "ಹಂಪಿಯ ವಿಜಯ ವಿಠ್ಠಲ ದೇವಾಲಯವು ಜಗತ್ತಿನಾದ್ಯಂತ ಪ್ರಸಿದ್ಧವಾಗಿದೆ. ದೇವಾಲಯದ ಅಂಗಳದಲ್ಲಿ ಸುಂದರವಾದ ಕಲ್ಲಿನ ರಥ ನಿಂತಿದೆ.",
        roman: "hampiya vijaya viTThala deevaalayavu jagattinaadyanta prasiddhavaagide. deevaalayada angaLadalli sundaravaada kallina ratha nintide.",
        meaning: "The Vijaya Vittala Temple of Hampi is famous across the world. In the temple courtyard stands the beautiful Stone Chariot.",
      },
      {
        script: "ಈ ದೇವಾಲಯದ ಮಂಟಪದಲ್ಲಿ ಐವತ್ತಾರು ಸಂಗೀತ ಕಂಬಗಳಿವೆ. ಅವುಗಳನ್ನು ಮೆಲ್ಲಗೆ ತಟ್ಟಿದರೆ ಸರಿಗಮಪದನಿ ಸ್ವರಗಳು ಕೇಳಿಸುತ್ತವೆ.",
        roman: "ii deevaalayada maNTapadalli aivattaaru sangiita kambagaLive. avugaLannu mellage taTTidare sarigamapadani svaragaLu keeLisuttave.",
        meaning: "In the hall of this temple there are fifty-six musical pillars. If you tap them gently, the musical notes Sa-Ri-Ga-Ma-Pa-Da-Ni can be heard.",
      },
      {
        script: "ಶಿಲ್ಪಿಗಳು ಗಟ್ಟಿಯಾದ ಕಲ್ಲಿನಲ್ಲಿಯೂ ಸಂಗೀತವನ್ನು ತುಂಬಿದರು. ಹಂಪಿ ಕರ್ನಾಟಕದ ಕಲೆ ಮತ್ತು ಇತಿಹಾಸದ ಹೆಮ್ಮೆಯ ಗುರುತು.",
        roman: "shilpigaLu gaTTiyaada kallinalliyuu sangiitavannu tumbidaru. hampi karnaaTakada kale mattu itihaasada hemmeya gurutu.",
        meaning: "The sculptors filled even hard stone with music. Hampi is a proud symbol of Karnataka's art and history.",
      },
    ],
    glossary: [
      { script: "ನದಿ", roman: "nadi", meaning: "River" },
      { script: "ನಗರ", roman: "nagara", meaning: "City" },
      { script: "ದೇವಾಲಯ", roman: "deevaalaya", meaning: "Temple" },
      { script: "ಕಲ್ಲು", roman: "kallu", meaning: "Stone" },
      { script: "ಸಂಗೀತ", roman: "sangiita", meaning: "Music" },
    ],
    references: [
      "Landmark: Vittala Temple & Stone Chariot, Hampi",
      "UNESCO World Heritage Site · 14th–16th century",
      "Poet of the era: Kumaravyasa (Gadugina Bharata)",
    ],
    postcardArt: "hampi",
  },
  {
    id: "kn.her.vachana",
    category: "stories",
    region: "Basavakalyana · 12th Century",
    title: "Vachanas — Poetry of the People",
    titleScript: "ವಚನ ಸಾಹಿತ್ಯ",
    titleRoman: "vachana saahitya",
    summary: "Short, luminous free-verse sayings in everyday Kannada that sparked one of India's earliest social revolutions.",
    story:
      "In the 12th century, Basavanna, Akka Mahadevi, and Allama Prabhu spoke in crisp everyday Kannada called Vachanas — teaching that honest work is sacred and every human soul is equal.",
    keyTerm: { script: "ಕಾಯಕವೇ ಕೈಲಾಸ", roman: "kaayakavee kailaasa", meaning: "Work is worship" },
    paragraphs: [
      {
        script: "ಹನ್ನೆರಡನೆಯ ಶತಮಾನದಲ್ಲಿ ಬಸವಣ್ಣನವರು ಬಸವಕಲ್ಯಾಣದಲ್ಲಿ ಅನುಭವ ಮಂಟಪವನ್ನು ಸ್ಥಾಪಿಸಿದರು. ಅಲ್ಲಿ ಎಲ್ಲಾ ಜನರು ಒಟ್ಟಾಗಿ ಕುಳಿತು ಚರ್ಚೆ ಮಾಡುತ್ತಿದ್ದರು.",
        roman: "hanneraDaneya shatamaanadalli basavaNNanavaru basavakalyaaNadalli anubhava maNTapavannu sthaapisidaru. alli ellaa janaru oTTaagi kuLitu charche maaDuttiddaru.",
        meaning: "In the twelfth century, Basavanna established the Anubhava Mantapa (Hall of Experience) in Basavakalyana. There, people from all walks of life sat together and discussed ideas.",
      },
      {
        script: "ಬಸವಣ್ಣ, ಅಕ್ಕಮಹಾದೇವಿ ಮತ್ತು ಅಲ್ಲಮಪ್ರಭು ಸರಳವಾದ ಕನ್ನಡದಲ್ಲಿ ವಚನಗಳನ್ನು ಬರೆದರು. ಸಾಮಾನ್ಯ ಜನರಿಗೂ ಈ ಮಾತುಗಳು ಸುಲಭವಾಗಿ ಅರ್ಥವಾಗುತ್ತಿದ್ದವು.",
        roman: "basavaNNa, akkamahaadeevi mattu allamaprabhu saraLavaada kannaDadalli vachanagaLannu baredaru. saamaanya janariguu ii maatugaLu sulabhavaagi arthavaaguttiddavu.",
        meaning: "Basavanna, Akka Mahadevi, and Allama Prabhu wrote Vachanas in simple Kannada. Even ordinary people could understand these words easily.",
      },
      {
        script: "ಕಾಯಕವೇ ಕೈಲಾಸ ಎಂಬುದು ವಚನಕಾರರ ಮುಖ್ಯ ಸಂದೇಶ. ಪ್ರಾಮಾಣಿಕವಾಗಿ ಮಾಡುವ ಪ್ರತಿಯೊಂದು ಕೆಲಸವೂ ಪವಿತ್ರವಾದದ್ದು.",
        roman: "kaayakavee kailaasa embudu vachanakaarara mukhya sandeesha. praamaaNikavaagi maaDuva pratiyondu kelasavuu pavitravaadaddu.",
        meaning: "'Work is worship' is the central message of the Vachana poets. Every job done honestly is sacred.",
      },
      {
        script: "ದಯವೇ ಧರ್ಮದ ಮೂಲವಯ್ಯ ಎಂದು ಬಸವಣ್ಣ ಹೇಳಿದರು. ಎಂಟುನೂರು ವರ್ಷಗಳ ನಂತರವೂ ವಚನಗಳು ನಮಗೆ ದಾರಿ ತೋರಿಸುತ್ತವೆ.",
        roman: "dayavee dharmada muulavayya endu basavaNNa heeLidaru. eNTunuuru varshagaLa nantaravuu vachanagaLu namage daari toorisuttave.",
        meaning: "Basavanna said, 'Compassion is the root of all dharma.' Even after eight hundred years, Vachanas guide our way.",
      },
    ],
    glossary: [
      { script: "ಜನರು", roman: "janaru", meaning: "People" },
      { script: "ಸರಳ", roman: "saraLa", meaning: "Simple" },
      { script: "ಕೆಲಸ", roman: "kelasa", meaning: "Work" },
      { script: "ದಯೆ", roman: "daye", meaning: "Compassion / kindness" },
      { script: "ದಾರಿ", roman: "daari", meaning: "Path / way" },
    ],
    references: [
      "Poets: Basavanna, Akka Mahadevi, Allama Prabhu",
      "Collection: Vachana Sahitya (over 20,000 verses)",
      "Concept: Anubhava Mantapa — Parliament of Experience",
    ],
    postcardArt: "bidar",
  },
  {
    id: "kn.her.visvesvaraya",
    category: "stories",
    region: "Muddenahalli & Mysuru",
    title: "Sir M. Visvesvaraya & KRS Dam",
    titleScript: "ಸರ್ ಎಂ. ವಿಶ್ವೇಶ್ವರಯ್ಯ",
    titleRoman: "sar em. vishveeshvarayya",
    summary: "The visionary engineer from Chikkaballapur who built the Krishna Raja Sagara dam and shaped modern Karnataka.",
    story:
      "Born in Muddenahalli, Bharat Ratna Sir Mokshagundam Visvesvaraya transformed Mysuru with the Krishna Raja Sagara dam, schools, banks, and industries — remembered every year on Engineer's Day.",
    keyTerm: { script: "ಶಿಸ್ತು ಮತ್ತು ಶ್ರಮ", roman: "shistu mattu shrama", meaning: "Discipline and hard work" },
    paragraphs: [
      {
        script: "ಚಿಕ್ಕಬಳ್ಳಾಪುರದ ಮುದ್ದೇನಹಳ್ಳಿಯಲ್ಲಿ ಸರ್ ಎಂ. ವಿಶ್ವೇಶ್ವರಯ್ಯ ಜನಿಸಿದರು. ಬಾಲ್ಯದಿಂದಲೇ ಅವರು ತುಂಬಾ ಶಿಸ್ತು ಮತ್ತು ಸಮಯಪಾಲನೆ ಹೊಂದಿದ್ದರು.",
        roman: "chikkabaLLaapurada muddeenahaLLiyalli sar em. vishveeshvarayya janisidaru. baalyadindalee avaru tumbaa shistu mattu samayapaalane hondiddaru.",
        meaning: "Sir M. Visvesvaraya was born in Muddenahalli in Chikkaballapur. From childhood, he had great discipline and punctuality.",
      },
      {
        script: "ಅವರು ಮೈಸೂರಿನ ದಿವಾನರಾಗಿ ರಾಜ್ಯದ ಅಭಿವೃದ್ಧಿಗಾಗಿ ಅನೇಕ ದೊಡ್ಡ ಯೋಜನೆಗಳನ್ನು ಮಾಡಿದರು. ಕಾವೇರಿ ನದಿಗೆ ಕೃಷ್ಣರಾಜಸಾಗರ ಅಣೆಕಟ್ಟು ಕಟ್ಟಿಸಿದರು.",
        roman: "avaru maisuurina divaanaraagi raajyada abhivRuddhigaagi aneeka doDDa yoojanegaLannu maaDidaru. kaaveeri nadige kRushNaraajasaagara aNekaTTu kaTTisidaru.",
        meaning: "As Diwan of Mysuru, he carried out many great projects for the state's progress. He built the Krishna Raja Sagara dam across the Kaveri river.",
      },
      {
        script: "ಈ ಅಣೆಕಟ್ಟಿನಿಂದ ರೈತರ ಹೊಲಗಳಿಗೆ ನೀರು ಸಿಕ್ಕಿತು ಮತ್ತು ಮೈಸೂರು ಹಾಗೂ ಬೆಂಗಳೂರಿಗೆ ವಿದ್ಯುತ್ ದೊರೆಯಿತು. ಅಣೆಕಟ್ಟಿನ ಕೆಳಗೆ ಸುಂದರ ಬೃಂದಾವನ ಉದ್ಯಾನವನ ಇದೆ.",
        roman: "ii aNekaTTininda raitara holagaLige niiru sikkitu mattu maisuuru haaguu bengaLuurige vidyut doreyitu. aNekaTTina keLage sundara bRundaavana udyaanavana ide.",
        meaning: "From this dam, farmers' fields received water and Mysuru and Bengaluru got electricity. Below the dam lies the beautiful Brindavan Gardens.",
      },
      {
        script: "ಅವರ ಜನ್ಮದಿನವಾದ ಸೆಪ್ಟೆಂಬರ್ ಹದಿನೈದನ್ನು ಭಾರತದಲ್ಲಿ ಎಂಜಿನಿಯರ್ಸ್ ದಿನವಾಗಿ ಆಚರಿಸುತ್ತಾರೆ. ಅವರ ಜೀವನ ನಮಗೆಲ್ಲರಿಗೂ ಮಾದರಿ.",
        roman: "avara janmadinavaada sepTembar hadinaidannu bhaaratadalli enjiniyars dinavaagi aacharisuttaare. avara jiivana namagellariguu maadari.",
        meaning: "His birthday, September 15th, is celebrated in India as Engineer's Day. His life is a role model for all of us.",
      },
    ],
    glossary: [
      { script: "ನೀರು", roman: "niiru", meaning: "Water" },
      { script: "ರೈತ", roman: "raita", meaning: "Farmer" },
      { script: "ಅಣೆಕಟ್ಟು", roman: "aNekaTTu", meaning: "Dam" },
      { script: "ಉದ್ಯಾನವನ", roman: "udyaanavana", meaning: "Garden / park" },
      { script: "ಜೀವನ", roman: "jiivana", meaning: "Life" },
    ],
    references: [
      "Landmark: Krishna Raja Sagara (KRS) Dam & Brindavan Gardens",
      "Honour: Bharat Ratna (1955) · Engineer's Day (Sep 15)",
      "Visit: Visvesvaraya Museum, Muddenahalli",
    ],
    postcardArt: "nandi",
  },

  // ───────────────── FOLK TALES (4) ─────────────────
  {
    id: "kn.her.punyakoti",
    category: "folk_tales",
    region: "Karnataka Folk Ballad",
    title: "Punyakoti — The Truthful Cow",
    titleScript: "ಪುಣ್ಯಕೋಟಿ — ಗೋವಿನ ಹಾಡು",
    titleRoman: "puNyakoTi — goovina haaDu",
    summary: "Karnataka's most beloved folk ballad about a gentle cow who keeps her promise even to a hungry tiger.",
    story:
      "Sung in homes and schools across Karnataka for generations, Govina Haadu tells of Punyakoti, whose honesty moves even a fierce tiger to tears.",
    keyTerm: { script: "ಸತ್ಯವೇ ನಮ್ಮ ತಾಯಿ ತಂದೆ", roman: "satyavee namma taayi tande", meaning: "Truth is our mother and father" },
    paragraphs: [
      {
        script: "ಧರಣಿ ಮಂಡಲ ಮಧ್ಯದೊಳಗೆ ಮೆರೆಯುತಿಹ ಕರ್ನಾಟ ದೇಶದಲ್ಲಿ ಪುಣ್ಯಕೋಟಿ ಎಂಬ ಒಂದು ಒಳ್ಳೆಯ ಹಸು ಇತ್ತು. ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ಅದು ಹಸಿರು ಹುಲ್ಲು ತಿನ್ನಲು ಬೆಟ್ಟಕ್ಕೆ ಹೋಗುತ್ತಿತ್ತು.",
        roman: "dharaNi maNDala madhyadoLage mereyutiha karnaaTa deeshadalli puNyakoTi emba ondu oLLeya hasu ittu. pratidina beLigge adu hasiru hullu tinnalu beTTakke hooguttittu.",
        meaning: "In the shining land of Karnataka lived a gentle cow named Punyakoti. Every morning she went to the hill to graze on green grass.",
      },
      {
        script: "ಒಂದು ಸಂಜೆ ಮನೆಗೆ ಹಿಂದಿರುಗುವಾಗ ಕಾಡಿನಲ್ಲಿ ಅರ್ಭುತ ಎಂಬ ಹಸಿದ ಹುಲಿ ಅವಳ ದಾರಿಯನ್ನು ತಡೆಯಿತು. ಹುಲಿಯನ್ನು ನೋಡಿ ಪುಣ್ಯಕೋಟಿ ಭಯಪಡದೆ ಶಾಂತವಾಗಿ ಮಾತನಾಡಿತು.",
        roman: "ondu sanje manege hindiruguvaaga kaaDinalli arbhuta emba hasida huli avaLa daariyannu taDeyitu. huliyannu nooDi puNyakoTi bhayapaDade shaantavaagi maatanaaDitu.",
        meaning: "One evening while returning home, a hungry tiger named Arbhuta blocked her path in the forest. Seeing the tiger, Punyakoti spoke calmly without fear.",
      },
      {
        script: "ಮನೆಯಲ್ಲಿ ನನ್ನ ಚಿಕ್ಕ ಕರು ಕಾಯುತ್ತಿದೆ. ಅದಕ್ಕೆ ಹಾಲು ಕೊಟ್ಟು ಮತ್ತೆ ಇಲ್ಲಿಗೆ ಬರುತ್ತೇನೆ ಎಂದು ಪುಣ್ಯಕೋಟಿ ಮಾತು ಕೊಟ್ಟಿತು. ಹುಲಿ ನಂಬಿ ಅವಳನ್ನು ಕಳುಹಿಸಿತು.",
        roman: "maneyalli nanna chikka karu kaayuttide. adakke haalu koTTu matte illige barutteene endu puNyakoTi maatu koTTitu. huli nambi avaLannu kaLuhisitu.",
        meaning: "'My little calf is waiting at home. I will give it milk and return here,' Punyakoti promised. The tiger trusted her and let her go.",
      },
      {
        script: "ಪುಣ್ಯಕೋಟಿ ಕರುವಿಗೆ ಹಾಲು ಕುಡಿಸಿ, ಕೊಟ್ಟ ಮಾತಿನಂತೆ ಮತ್ತೆ ಕಾಡಿಗೆ ಬಂತು. ಅವಳ ಸತ್ಯನಿಷ್ಠೆಯನ್ನು ಕಂಡು ಹುಲಿಯ ಮನಸ್ಸು ಕರಗಿತು ಮತ್ತು ಅದು ಅವಳನ್ನು ಉಳಿಸಿತು. ಸತ್ಯವೇ ನಮ್ಮ ತಾಯಿ ತಂದೆ!",
        roman: "puNyakoTi karuvige haalu kuDisi, koTTa maatinante matte kaaDige bantu. avaLa satyaniShTheyannu kaNDu huliya manassu karagitu mattu adu avaLannu uLisitu. satyavee namma taayi tande!",
        meaning: "Punyakoti fed milk to her calf and returned to the forest as promised. Seeing her truthfulness, the tiger's heart melted and he spared her. Truth is our mother and father!",
      },
    ],
    glossary: [
      { script: "ಹಸು", roman: "hasu", meaning: "Cow" },
      { script: "ಹುಲಿ", roman: "huli", meaning: "Tiger" },
      { script: "ಕರು", roman: "karu", meaning: "Calf" },
      { script: "ಹಾಲು", roman: "haalu", meaning: "Milk" },
      { script: "ಸತ್ಯ", roman: "satya", meaning: "Truth" },
    ],
    readingPassage: {
      script: "ಪುಣ್ಯಕೋಟಿ ಎಂಬ ಹಸು ಕಾಡಿನಲ್ಲಿ ಹುಲಿಯನ್ನು ಕಂಡಿತು. ನನ್ನ ಕರುವಿಗೆ ಹಾಲು ಕೊಟ್ಟು ಬರುತ್ತೇನೆ ಎಂದು ಹಸು ಹೇಳಿತು.",
      roman: "puNyakoTi emba hasu kaaDinalli huliyannu kaNDitu. nanna karuvige haalu koTTu barutteene endu hasu heeLitu.",
      meaning: "A cow named Punyakoti met a tiger in the forest. 'I will give milk to my calf and return,' the cow said.",
    },
    references: [
      "Folk Song: Dharani Mandala Madhyadolage (Govina Haadu)",
      "Theme: Honesty, compassion, and keeping one's word",
    ],
    postcardArt: "bandipur",
  },
  {
    id: "kn.her.tenali",
    category: "folk_tales",
    region: "Vijayanagara · Folk Wit",
    title: "Tenali Rama & the Mango Tree",
    titleScript: "ತೆನಾಲಿ ರಾಮನ ಜಾಣ್ಮೆ",
    titleRoman: "tenaali raamana jaaNme",
    summary: "A playful Vijayanagara court tale of quick wit, humour, and humble wisdom from the golden age of Hampi.",
    story:
      "Grandparents across Karnataka delight children with clever folk tales set in the lively court of King Krishnadevaraya, where Tenali Rama's gentle wit solves every puzzle.",
    keyTerm: { script: "ಜಾಣ್ಮೆ", roman: "jaaNme", meaning: "Cleverness / practical wisdom" },
    paragraphs: [
      {
        script: "ವಿಜಯನಗರದ ರಾಜ ಕೃಷ್ಣದೇವರಾಯರ ಆಸ್ಥಾನದಲ್ಲಿ ತೆನಾಲಿ ರಾಮ ಎಂಬ ಜಾಣ ವಿದೂಷಕ ಇದ್ದನು. ರಾಜರಿಗೆ ಅವನ ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು ಹಾಸ್ಯ ತುಂಬಾ ಇಷ್ಟವಾಗುತ್ತಿತ್ತು.",
        roman: "vijayanagarada raaja kRushNadeevaraayara aasthaanadalli tenaali raama emba jaaNa viduuShaka iddanu. raajarige avana buddhivantike mattu haasya tumbaa iShTavaaguttittu.",
        meaning: "In the court of Vijayanagara's King Krishnadevaraya lived a clever jester named Tenali Rama. The king loved his intelligence and humour.",
      },
      {
        script: "ಒಂದು ದಿನ ರಾಜರು ಅರಮನೆಯ ತೋಟದಲ್ಲಿ ನಡೆಯುತ್ತಾ, ಒಬ್ಬ ವೃದ್ಧ ರೈತ ಚಿಕ್ಕ ಮಾವಿನ ಸಸಿ ನೆಡುವುದನ್ನು ನೋಡಿದರು. 'ಈ ಮರದ ಹಣ್ಣು ತಿನ್ನಲು ನೀನು ಇರುತ್ತೀಯಾ?' ಎಂದು ರಾಜರು ಕೇಳಿದರು.",
        roman: "ondu dina raajaru aramaneya tooTadalli naDeyuttaa, obba vRuddha raita chikka maavina sasi neDuvudannu nooDidaru. 'ii marada haNNu tinnalu niinu iruttiiyaa?' endu raajaru keeLidaru.",
        meaning: "One day while walking in the palace garden, the king saw an old farmer planting a small mango sapling. 'Will you be around to eat the fruit of this tree?' the king asked.",
      },
      {
        script: "ಆಗ ತೆನಾಲಿ ರಾಮ ನಗುತ್ತಾ ಹೇಳಿದನು: 'ಮಹಾರಾಜರೇ, ನಮ್ಮ ತಾತ ನೆಟ್ಟ ಮರದ ಹಣ್ಣನ್ನು ನಾವು ತಿಂದೆವು. ಈಗ ನೆಡುವ ಮರದ ಹಣ್ಣನ್ನು ನಮ್ಮ ಮಕ್ಕಳು ತಿನ್ನುತ್ತಾರೆ.'",
        roman: "aaga tenaali raama naguttaa heeLidanu: 'mahaaraajaree, namma taata neTTa marada haNNannu naavu tindevu. iiga neDuva marada haNNannu namma makkaLu tinnuttaare.'",
        meaning: "Then Tenali Rama smiled and said: 'Your Majesty, we ate the fruit of trees our grandfathers planted. Our children will eat the fruit of the trees we plant today.'",
      },
      {
        script: "ಈ ಸುಂದರ ಉತ್ತರ ಕೇಳಿ ರಾಜರಿಗೆ ತುಂಬಾ ಸಂತೋಷವಾಯಿತು. ಜಾಣ್ಮೆ ಮತ್ತು ಒಳ್ಳೆಯ ಮನಸ್ಸು ಯಾವಾಗಲೂ ಎಲ್ಲರನ್ನೂ ಗೆಲ್ಲುತ್ತದೆ.",
        roman: "ii sundara uttara keeLi raajarige tumbaa santoShavaayitu. jaaNme mattu oLLeya manassu yaavaagaluu ellarannuu gelluttade.",
        meaning: "Hearing this beautiful answer, the king was very happy. Wisdom and a kind heart always win everyone over.",
      },
    ],
    glossary: [
      { script: "ರಾಜ", roman: "raaja", meaning: "King" },
      { script: "ತೋಟ", roman: "tooTa", meaning: "Garden" },
      { script: "ಮರ", roman: "mara", meaning: "Tree" },
      { script: "ಹಣ್ಣು", roman: "haNNu", meaning: "Fruit" },
      { script: "ಉತ್ತರ", roman: "uttara", meaning: "Answer" },
    ],
    readingPassage: {
      script: "ಒಂದು ದಿನ ರಾಜನ ಅರಮನೆಯಲ್ಲಿ ಒಂದು ದೊಡ್ಡ ಪ್ರಶ್ನೆ ಬಂತು. ಜಾಣ್ಮೆಯಿಂದ ಎಲ್ಲಾ ಸಮಸ್ಯೆಗಳಿಗೆ ಉತ್ತರ ಸಿಗುತ್ತದೆ.",
      roman: "ondu dina raajana aramaneyalli ondu doDDa prashne bantu. jaaNmeyinda ellaa samasyegaLige uttara siguttade.",
      meaning: "One day a big question arose in the king's palace. With wisdom, every problem finds an answer.",
    },
    references: [
      "Setting: Court of Emperor Krishnadevaraya in Vijayanagara",
      "Tradition: Ajji Kathegalu (Grandmother's bedtime tales)",
    ],
    postcardArt: "pattadakal",
  },
  {
    id: "kn.her.kaveri",
    category: "folk_tales",
    region: "Talakaveri · Kodagu",
    title: "The Legend of River Kaveri",
    titleScript: "ಕಾವೇರಿ ನದಿಯ ಕಥೆ",
    titleRoman: "kaaveeri nadiya kathe",
    summary: "How a sacred spring in the misty Brahmagiri hills of Kodagu became Karnataka's life-giving river.",
    story:
      "Born in the green hills of Talakaveri in Kodagu, the folk legend of River Kaveri celebrates nature's generosity — flowing across Mysuru and Mandya to nourish millions.",
    keyTerm: { script: "ಕಾವೇರಿ ತಾಯಿ", roman: "kaaveeri taayi", meaning: "Mother Kaveri" },
    paragraphs: [
      {
        script: "ಕೊಡಗಿನ ಹಸಿರು ಬ್ರಹ್ಮಗಿರಿ ಬೆಟ್ಟದಲ್ಲಿ ತಲಕಾವೇರಿ ಎಂಬ ಪವಿತ್ರ ಸ್ಥಳ ಇದೆ. ಇಲ್ಲಿಂದಲೇ ಕರ್ನಾಟಕದ ಜೀವನದಿಯಾದ ಕಾವೇರಿ ಹುಟ್ಟುತ್ತಾಳೆ.",
        roman: "koDagina hasiru brahmagiri beTTadalli talakaaveeri emba pavitra sthaLa ide. illindalee karnaaTakada jiivanadiyaada kaaveeri huTTuttaaLe.",
        meaning: "In the green Brahmagiri hills of Kodagu lies the sacred place of Talakaveri. From right here, Karnataka's lifeline river Kaveri is born.",
      },
      {
        script: "ಪುರಾತನ ಕಥೆಯ ಪ್ರಕಾರ, ಅಗಸ್ತ್ಯ ಮುನಿಗಳ ಕಮಂಡಲದಲ್ಲಿದ್ದ ಪವಿತ್ರ ನೀರು ಒಂದು ಚಿಕ್ಕ ಕಾಗೆಯ ರೆಕ್ಕೆ ತಾಗಿ ಕೆಳಗೆ ಚೆಲ್ಲಿತು. ಆ ನೀರೇ ಹರಿಯುತ್ತಾ ಕಾವೇರಿ ನದಿಯಾಯಿತು.",
        roman: "puraatana katheya prakaara, agastya munigaLa kamaNDaladallidda pavitra niiru ondu chikka kaageya rekke taagi keLage chellitu. aa niiree hariyuttaa kaaveeri nadiyaayitu.",
        meaning: "According to the ancient tale, sacred water in Sage Agastya's pot spilled when touched by a little crow's wing. That flowing water became the River Kaveri.",
      },
      {
        script: "ಕಾವೇರಿ ನದಿ ಬೆಟ್ಟಗಳಿಂದ ಇಳಿದು ಹಳ್ಳಿಗಳು, ಗದ್ದೆಗಳು ಮತ್ತು ಊರುಗಳಿಗೆ ತಂಪಾದ ನೀರು ಕೊಡುತ್ತದೆ. ಮಂಡ್ಯ ಮತ್ತು ಮೈಸೂರಿನ ಹಸಿರು ಹೊಲಗಳು ಈ ನದಿಯಿಂದಲೇ ನಳನಳಿಸುತ್ತವೆ.",
        roman: "kaaveeri nadi beTTagaLinda iLidu haLLigaLu, gaddegaLu mattu uurugaLige tampaada niiru koDuttade. maNDya mattu maisuurina hasiru holagaLu ii nadiyindalee naLanaLisuttave.",
        meaning: "Descending from the hills, the Kaveri gives cool water to villages, fields, and towns. The green fields of Mandya and Mysuru flourish because of this river.",
      },
      {
        script: "ಪ್ರತಿ ವರ್ಷ ತುಲಾ ಸಂಕ್ರಮಣದ ದಿನ ಜನರು ತಲಕಾವೇರಿಗೆ ಹೋಗಿ ಕಾವೇರಿ ತಾಯಿಗೆ ನಮಸ್ಕಾರ ಮಾಡುತ್ತಾರೆ. ನೀರನ್ನು ಗೌರವಿಸುವುದು ನಮ್ಮ ಸುಂದರ ಸಂಪ್ರದಾಯ.",
        roman: "prati varSha tulaa sankramaNada dina janaru talakaaveerige hoogi kaaveeri taayige namaskaara maaDuttaare. niirannu gauravisuvudu namma sundara sampradaaya.",
        meaning: "Every year on Tula Sankramana, people visit Talakaveri and pay respects to Mother Kaveri. Honouring water is our beautiful tradition.",
      },
    ],
    glossary: [
      { script: "ಬೆಟ್ಟ", roman: "beTTa", meaning: "Hill / mountain" },
      { script: "ಕಾಗೆ", roman: "kaage", meaning: "Crow" },
      { script: "ಹಸಿರು", roman: "hasiru", meaning: "Green" },
      { script: "ತಂಪು", roman: "tampu", meaning: "Cool" },
      { script: "ತಾಯಿ", roman: "taayi", meaning: "Mother" },
    ],
    references: [
      "Place: Talakaveri & Bhagamandala, Kodagu",
      "Festival: Tula Sankramana (October)",
    ],
    postcardArt: "coorg",
  },
  {
    id: "kn.her.obbavva",
    category: "folk_tales",
    region: "Chitradurga · Folk Heroine",
    title: "Onake Obavva of Chitradurga",
    titleScript: "ಒನಕೆ ಓಬವ್ವನ ಧೈರ್ಯ",
    titleRoman: "onake oobavvana dhairya",
    summary: "The fearless guard's wife who defended Chitradurga's seven-ringed stone fort armed only with a wooden pestle.",
    story:
      "Remembered in folk songs across central Karnataka, Onake Obavva's quick thinking and extraordinary courage saved Chitradurga Fort during a surprise midnight attack.",
    keyTerm: { script: "ಧೈರ್ಯ", roman: "dhairya", meaning: "Courage / bravery" },
    paragraphs: [
      {
        script: "ಚಿತ್ರದುರ್ಗದಲ್ಲಿ ಏಳು ಸುತ್ತಿನ ದೊಡ್ಡ ಕಲ್ಲಿನ ಕೋಟೆ ಇದೆ. ಆ ಕೋಟೆಯ ಒಂದು ರಹಸ್ಯ ಕಿಂಡಿಯ ಬಳಿ ಕಹಳೆ ಮುದ್ದಹನುಮ ಎಂಬ ಕಾವಲುಗಾರನ ಮನೆ ಇತ್ತು.",
        roman: "chitradurgadalli eeLu suttina doDDa kallina kooTe ide. aa kooTeya ondu rahasya kiNDiya baLi kahaLe muddahanuma emba kaavalugaarana mane ittu.",
        meaning: "In Chitradurga stands a great seven-ringed stone fort. Near a secret crevice in that fort was the home of a watchman named Kahale Muddahanuma.",
      },
      {
        script: "ಒಂದು ದಿನ ಮಧ್ಯಾಹ್ನ ಕಾವಲುಗಾರ ಊಟ ಮಾಡುತ್ತಿದ್ದಾಗ, ಅವನ ಹೆಂಡತಿ ಓಬವ್ವ ನೀರು ತರಲು ಹೊರಗೆ ಹೋದಳು. ಆಗ ಕೋಟೆಯ ಕಿಂಡಿಯಿಂದ ಶತ್ರು ಸೈನಿಕರು ಒಳಗೆ ಬರುವ ಶಬ್ದ ಕೇಳಿಸಿತು.",
        roman: "ondu dina madhyaahna kaavalugaara uuTa maaDuttiddaaga, avana heNDati oobavva niiru taralu horage hoodaLu. aaga kooTeya kiNDiyinda shatru sainikaru oLage baruva shabda keeLisitu.",
        meaning: "One afternoon while the watchman was eating lunch, his wife Obavva stepped out to fetch water. Just then she heard the sound of enemy soldiers creeping through the fort crevice.",
      },
      {
        script: "ಓಬವ್ವ ಗಾಬರಿಯಾಗಲಿಲ್ಲ. ಮನೆಯಲ್ಲಿ ರಾಗಿ ಕುಟ್ಟುವ ದೊಡ್ಡ ಮರದ ಒನಕೆಯನ್ನು ತೆಗೆದುಕೊಂಡು ಕಿಂಡಿಯ ಪಕ್ಕದಲ್ಲಿ ನಿಂತಳು. ಒಳಗೆ ಬಂದ ಪ್ರತಿಯೊಬ್ಬ ಶತ್ರುವನ್ನೂ ಅವಳು ಧೈರ್ಯದಿಂದ ತಡೆದಳು.",
        roman: "oobavva gaabariyaagalilla. maneyalli raagi kuTTuva doDDa marada onakeyannu tegedukoNDu kiNDiya pakkadalli nintaLu. oLage banda pratiyobba shatruvannuu avaLu dhairyadinda taDedaLu.",
        meaning: "Obavva did not panic. Picking up the heavy wooden pestle used to pound ragi at home, she stood beside the crevice and bravely stopped every soldier who came through.",
      },
      {
        script: "ತನ್ನ ಅಸಾಧಾರಣ ಧೈರ್ಯದಿಂದ ಓಬವ್ವ ಇಡೀ ಕೋಟೆಯನ್ನು ರಕ್ಷಿಸಿದಳು. ಇಂದಿಗೂ ಚಿತ್ರದುರ್ಗದ ಆ ಸ್ಥಳವನ್ನು 'ಒನಕೆ ಓಬವ್ವನ ಕಿಂಡಿ' ಎಂದು ಗೌರವದಿಂದ ಕರೆಯುತ್ತಾರೆ.",
        roman: "tanna asaadhaaraNa dhairyadinda oobavva iDii kooTeyannu rakShisidaLu. indiguu chitradurgada aa sthaLavannu 'onake oobavvana kiNDi' endu gauravadinda kareyuttaare.",
        meaning: "With her extraordinary courage, Obavva saved the entire fort. Even today, that spot in Chitradurga is respectfully called 'Onake Obavva's Crevice'.",
      },
    ],
    glossary: [
      { script: "ಕೋಟೆ", roman: "kooTe", meaning: "Fort" },
      { script: "ಮನೆ", roman: "mane", meaning: "House / home" },
      { script: "ಒನಕೆ", roman: "onake", meaning: "Wooden pestle" },
      { script: "ಶಬ್ದ", roman: "shabda", meaning: "Sound" },
      { script: "ಧೈರ್ಯ", roman: "dhairya", meaning: "Courage" },
    ],
    references: [
      "Landmark: Chitradurga Fort & Onake Obavva Kindi",
      "Commemoration: Onake Obavva Jayanti (November 11)",
    ],
    postcardArt: "shravanabelagola",
  },

  // ───────────────── TRADITIONS (4) ─────────────────
  {
    id: "kn.her.dasara",
    category: "traditions",
    region: "Mysuru · State Festival",
    title: "Mysuru Dasara — Nadahabba",
    titleScript: "ಮೈಸೂರು ದಸರಾ",
    titleRoman: "maisuru dasaraa",
    summary: "Ten nights of classical concerts, doll displays, and 100,000 golden bulbs illuminating Amba Vilas Palace.",
    story:
      "Celebrated for over 400 years, Mysuru Dasara is Karnataka's Nadahabba (state festival) — filled with Gombe Habba dolls, palace concerts, and the Jamboo Savari.",
    keyTerm: { script: "ನಾಡಹಬ್ಬ", roman: "naaDahabba", meaning: "Festival of the land" },
    paragraphs: [
      {
        script: "ಮೈಸೂರು ದಸರಾ ಕರ್ನಾಟಕದ ಪ್ರಸಿದ್ಧ ನಾಡಹಬ್ಬ. ಇದನ್ನು ಪ್ರತಿ ವರ್ಷ ಹತ್ತು ದಿನಗಳ ಕಾಲ ತುಂಬಾ ಸಂಭ್ರಮದಿಂದ ಆಚರಿಸುತ್ತಾರೆ.",
        roman: "maisuuru dasaraa karnaaTakada prasiddha naaDahabba. idannu prati varSha hattu dinagaLa kaala tumbaa sambhramadinda aacharisuttaare.",
        meaning: "Mysuru Dasara is Karnataka's famous state festival. Every year it is celebrated with great joy for ten days.",
      },
      {
        script: "ಈ ಸಮಯದಲ್ಲಿ ಮೈಸೂರಿನ ಅಂಬಾ ವಿಲಾಸ ಅರಮನೆ ಒಂದು ಲಕ್ಷ ದೀಪಗಳಿಂದ ಚಿನ್ನದಂತೆ ಹೊಳೆಯುತ್ತದೆ. ಸಂಜೆ ಅರಮನೆಯ ಆವರಣದಲ್ಲಿ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ ಕಾರ್ಯಕ್ರಮಗಳು ನಡೆಯುತ್ತವೆ.",
        roman: "ii samayadalli maisuurina ambaa vilaasa aramane ondu lakSha diipagaLinda chinnadante hoLeyuttade. sanje aramaneya aavaraNadalli shaastriiya sangiita kaaryakramagaLu naDeyuttave.",
        meaning: "During this time, Mysuru's Amba Vilas Palace glows like gold with a hundred thousand lights. In the evenings, classical music concerts take place in the palace courtyard.",
      },
      {
        script: "ಮನೆಮನೆಗಳಲ್ಲಿ ಪಟ್ಟದ ಗೊಂಬೆಗಳನ್ನು ಜೋಡಿಸಿ ಗೊಂಬೆ ಹಬ್ಬ ಮಾಡುತ್ತಾರೆ. ಮಕ್ಕಳು ಮತ್ತು ನೆರೆಹೊರೆಯವರು ಮನೆಗೆ ಬಂದು ಗೊಂಬೆಗಳನ್ನು ನೋಡಿ ಸಿಹಿ ತಿನ್ನುತ್ತಾರೆ.",
        roman: "manemanegaLalli paTTada gombegaLannu jooDisi gombe habba maaDuttaare. makkaLu mattu nerehoreyavaru manege bandu gombegaLannu nooDi sihi tinnuttaare.",
        meaning: "In every home, families arrange festive dolls for Gombe Habba. Children and neighbours visit to see the dolls and share sweets.",
      },
      {
        script: "ಹತ್ತನೆಯ ದಿನ ವಿಜಯದಶಮಿಯಂದು ಭವ್ಯವಾದ ಜಂಬೂ ಸವಾರಿ ನಡೆಯುತ್ತದೆ. ಅಲಂಕಾರಗೊಂಡ ಆನೆಗಳು ಮತ್ತು ಜಾನಪದ ಕಲಾವಿದರು ಮೈಸೂರಿನ ಬೀದಿಗಳಲ್ಲಿ ಸಾಗುತ್ತಾರೆ.",
        roman: "hattaneya dina vijayadashamiyandu bhavyavaada jambuu savaari naDeyuttade. alankaaragoNDa aanegaLu mattu jaanapada kalaavidaru maisuurina biidigaLalli saaguttaare.",
        meaning: "On the tenth day, Vijayadashami, the grand Jamboo Savari procession takes place. Decorated elephants and folk artists march through the streets of Mysuru.",
      },
    ],
    glossary: [
      { script: "ಹಬ್ಬ", roman: "habba", meaning: "Festival" },
      { script: "ಅರಮನೆ", roman: "aramane", meaning: "Palace" },
      { script: "ದೀಪ", roman: "diipa", meaning: "Lamp / light" },
      { script: "ಗೊಂಬೆ", roman: "gombe", meaning: "Doll" },
      { script: "ಆನೆ", roman: "aane", meaning: "Elephant" },
    ],
    references: [
      "Tradition: Gombe Habba (festive doll displays)",
      "Highlight: Illuminated Mysuru Palace & Jamboo Savari",
      "Season: Ashwayuja month (September–October)",
    ],
    postcardArt: "mysuru",
  },
  {
    id: "kn.her.oota",
    category: "traditions",
    region: "Across Karnataka",
    title: "Bale Ele Oota & Filter Kaapi",
    titleScript: "ಬಾಳೆ ಎಲೆ ಊಟ ಮತ್ತು ಕಾಫಿ",
    titleRoman: "baaLe ele uuTa mattu kaafi",
    summary: "The generous hospitality of a banana-leaf feast and frothy Chikmagalur coffee poured high in brass.",
    story:
      "A traditional Karnataka meal on a fresh green banana leaf and a frothy brass tumbler of Chikmagalur filter coffee capture the warmth of Kannada hospitality.",
    keyTerm: { script: "ಊಟ ಆಯ್ತಾ?", roman: "uuTa aaytaa?", meaning: "Have you eaten? (a warm greeting)" },
    paragraphs: [
      {
        script: "ಕರ್ನಾಟಕದಲ್ಲಿ ಮನೆಗೆ ಬಂದ ಅತಿಥಿಗಳನ್ನು 'ಊಟ ಆಯ್ತಾ?' ಎಂದು ಪ್ರೀತಿಯಿಂದ ಕೇಳುವುದು ಸಾಮಾನ್ಯ. ಹಬ್ಬದ ದಿನಗಳಲ್ಲಿ ತಾಜಾ ಹಸಿರು ಬಾಳೆ ಎಲೆಯ ಮೇಲೆ ಊಟ ಬಡಿಸುತ್ತಾರೆ.",
        roman: "karnaaTakadalli manege banda atithigaLannu 'uuTa aaytaa?' endu priitiyinda keeLuvudu saamaanya. habbada dinagaLalli taajaa hasiru baaLe eleya meele uuTa baDisuttaare.",
        meaning: "In Karnataka, it is common to warmly ask guests 'Have you eaten?'. On festive days, meals are served on a fresh green banana leaf.",
      },
      {
        script: "ಎಲೆಯ ಎಡಭಾಗದಲ್ಲಿ ಕೋಸಂಬರಿ, ಉಪ್ಪಿನಕಾಯಿ ಮತ್ತು ಪಲ್ಯ ಇರುತ್ತವೆ. ಮಧ್ಯದಲ್ಲಿ ಬಿಸಿ ಅನ್ನ, ತುಪ್ಪ, ಹಸಿರು ಸೊಪ್ಪಿನ ಸಾರು ಮತ್ತು ಹಪ್ಪಳ ಇರುತ್ತವೆ.",
        roman: "eleya eDabhaagadalli koosambari, uppinakaayi mattu palya iruttave. madhyadalli bisi anna, tuppa, hasiru soppina saaru mattu happaLa iruttave.",
        meaning: "On the left of the leaf sit kosambari salad, pickle, and stir-fried vegetables. In the centre are hot rice, ghee, lentil saaru, and crisp happala.",
      },
      {
        script: "ಕೊನೆಯಲ್ಲಿ ಬಿಸಿ ಬಿಸಿ ಹೋಳಿಗೆ ಅಥವಾ ಪಾಯಸ ತಿನ್ನುವುದರಿಂದ ಊಟ ಸಂಪೂರ್ಣವಾಗುತ್ತದೆ. ಬಿಸಿಬೇಳೆ ಬಾತ್, ರಾಗಿ ಮುದ್ದೆ ಮತ್ತು ಮೈಸೂರು ಪಾಕ್ ಕರ್ನಾಟಕದ ಹೆಮ್ಮೆಯ ರುಚಿಗಳು.",
        roman: "koneyalli bisi bisi hooLige athavaa paayasa tinnuvudarinda uuTa sampuurNavaaguttade. bisibeeLe baat, raagi mudde mattu maisuuru paak karnaaTakada hemmeya ruchigaLu.",
        meaning: "Finishing with warm holige or sweet payasa completes the meal. Bisibelebath, ragi mudde, and Mysore Pak are proud flavours of Karnataka.",
      },
      {
        script: "ಬೆಳಿಗ್ಗೆ ಮತ್ತು ಸಂಜೆ ಚಿಕ್ಕಮಗಳೂರಿನ ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಇಲ್ಲದೆ ದಿನ ಪೂರ್ಣವಾಗುವುದಿಲ್ಲ. ಹಿತ್ತಾಳೆಯ ದಾವರ-ಲೋಟದಲ್ಲಿ ನೊರೆಯೊಂದಿಗೆ ಕಾಫಿ ಕುಡಿಯುವ ಮಜವೇ ಬೇರೆ!",
        roman: "beLigge mattu sanje chikkamagaLuurina bisi philTar kaafi illade dina puurNavaaguvudilla. hittaaLeya daavara-looTadalli noreyondige kaafi kuDiyuva majavee beere!",
        meaning: "Mornings and evenings feel incomplete without hot Chikmagalur filter coffee. Drinking frothy coffee from a brass davara-tumbler is a joy of its own!",
      },
    ],
    glossary: [
      { script: "ಊಟ", roman: "uuTa", meaning: "Meal" },
      { script: "ಬಾಳೆ ಎಲೆ", roman: "baaLe ele", meaning: "Banana leaf" },
      { script: "ಅನ್ನ", roman: "anna", meaning: "Cooked rice" },
      { script: "ಬಿಸಿ", roman: "bisi", meaning: "Hot / warm" },
      { script: "ರುಚಿ", roman: "ruchi", meaning: "Taste / flavour" },
    ],
    references: [
      "Classics: Bisibelebath, Ragi Mudde, Mysore Pak, Neer Dose",
      "Coffee Country: Chikmagalur & Kodagu Arabica estates",
      "Iconic spots: Vidyarthi Bhavan, CTR, Mavalli Tiffin Rooms",
    ],
    postcardArt: "malleswaram",
  },
  {
    id: "kn.her.ugadi",
    category: "traditions",
    region: "Across Karnataka",
    title: "Ugadi & the Taste of Bevu-Bella",
    titleScript: "ಯುಗಾದಿ — ಬೇವು ಬೆಲ್ಲ",
    titleRoman: "yugaadi — beevu bella",
    summary: "Welcoming the Kannada New Year with mango-leaf toranas and a spoonful of bitter neem and sweet jaggery.",
    story:
      "On Ugadi morning, families string fresh mango leaves over doorways and share Bevu-Bella — a reminder to welcome life's sweet and bitter moments with grace.",
    keyTerm: { script: "ಯುಗಾದಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು", roman: "yugaadi habbada shubhaashayagaLu", meaning: "Happy Ugadi!" },
    paragraphs: [
      {
        script: "ಯುಗಾದಿ ಕನ್ನಡದ ಹೊಸ ವರ್ಷದ ಮೊದಲ ದಿನ. ಚೈತ್ರ ಮಾಸದ ವಸಂತ ಕಾಲದಲ್ಲಿ ಮರಗಳಲ್ಲಿ ಹೊಸ ಹಸಿರು ಚಿಗುರು ಮೂಡುತ್ತದೆ.",
        roman: "yugaadi kannaDada hosa varShada modala dina. chaitra maasada vasanta kaaladalli maragaLalli hosa hasiru chiguru muuDuttade.",
        meaning: "Ugadi is the first day of the Kannada New Year. In the spring season of Chaitra, fresh green shoots appear on the trees.",
      },
      {
        script: "ಬೆಳಿಗ್ಗೆ ಮನೆಯ ಬಾಗಿಲಿಗೆ ತಾಜಾ ಮಾವಿನ ಎಲೆ ಮತ್ತು ಚೆಂಡು ಹೂವಿನ ತೋರಣ ಕಟ್ಟುತ್ತಾರೆ. ಮನೆಯ ಮುಂದೆ ಸುಂದರವಾದ ರಂಗೋಲಿ ಹಾಕುತ್ತಾರೆ.",
        roman: "beLigge maneya baagilige taajaa maavina ele mattu cheNDu huuvina tooraNa kaTTuttaare. maneya munde sundaravaada rangooli haakuttaare.",
        meaning: "In the morning, families tie fresh mango-leaf and marigold garlands on the doorway. Beautiful rangoli patterns are drawn in front of the house.",
      },
      {
        script: "ಎಲ್ಲರೂ ಒಟ್ಟಾಗಿ ಬೇವು ಮತ್ತು ಬೆಲ್ಲವನ್ನು ಹಂಚಿಕೊಂಡು ತಿನ್ನುತ್ತಾರೆ. ಜೀವನದಲ್ಲಿ ಕಹಿ ಮತ್ತು ಸಿಹಿ ಎರಡನ್ನೂ ಸಮಾನವಾಗಿ ಸ್ವೀಕರಿಸಬೇಕು ಎಂಬುದು ಇದರ ಅರ್ಥ.",
        roman: "ellaruu oTTaagi beevu mattu bellavannu hanchikoNDu tinnuttaare. jiivanadalli kahi mattu sihi eraDannuu samaanavaagi sviikarisabeeku embudu idara artha.",
        meaning: "Everyone shares and eats neem blossoms mixed with jaggery together. It means we should accept both bitter and sweet moments in life equally.",
      },
      {
        script: "ಮಧ್ಯಾಹ್ನ ತುಪ್ಪದೊಂದಿಗೆ ಸಿಹಿ ಒಬ್ಬಟ್ಟು ಸವಿಯುತ್ತಾರೆ. 'ಬೇವು ಬೆಲ್ಲ ತಿಂದು ಒಳ್ಳೆ ಮಾತಾಡಿ' ಎಂದು ಎಲ್ಲರಿಗೂ ಶುಭಾಶಯ ಹೇಳುತ್ತಾರೆ.",
        roman: "madhyaahna tuppadondige sihi obbaTTu saviyuttaare. 'beevu bella tindu oLLe maataaDi' endu ellariguu shubhaashaya heeLuttaare.",
        meaning: "At lunch, families savour sweet obbattu with ghee. Everyone greets each other saying, 'Eat neem and jaggery, and speak kindly.'",
      },
    ],
    glossary: [
      { script: "ಹೊಸ ವರ್ಷ", roman: "hosa varSha", meaning: "New Year" },
      { script: "ಬಾಗಿಲು", roman: "baagilu", meaning: "Door" },
      { script: "ಹೂವು", roman: "huuvu", meaning: "Flower" },
      { script: "ಬೇವು", roman: "beevu", meaning: "Neem (bitter)" },
      { script: "ಬೆಲ್ಲ", roman: "bella", meaning: "Jaggery (sweet)" },
    ],
    references: [
      "Festive sweet: Obbattu / Holige with warm ghee",
      "Tradition: Panchanga Shravana & mango-leaf torana",
      "Saying: Bevu bella tindu oLLe maataaDi (speak kindly)",
    ],
    postcardArt: "krmarket",
  },
  {
    id: "kn.her.kambala",
    category: "traditions",
    region: "Karavali · Tulunadu Coast",
    title: "Kambala & Coastal Harvest",
    titleScript: "ಕರಾವಳಿಯ ಕಂಬಳ",
    titleRoman: "karaavaLiya kambaLa",
    summary: "A joyful post-harvest coastal tradition celebrating paddy fields, community spirit, and the rains of Tulunadu.",
    story:
      "After the coastal monsoon paddy harvest in Dakshina Kannada and Udupi, villages gather for Kambala — a colourful folk celebration of farming, music, and coastal gratitude.",
    keyTerm: { script: "ಸುಗ್ಗಿ ಹಬ್ಬ", roman: "suggi habba", meaning: "Harvest festival" },
    paragraphs: [
      {
        script: "ಕರ್ನಾಟಕದ ಕರಾವಳಿ ಭಾಗವಾದ ಮಂಗಳೂರು ಮತ್ತು ಉಡುಪಿಯಲ್ಲಿ ಕಂಬಳ ಒಂದು ಪ್ರಸಿದ್ಧ ಜಾನಪದ ಸಂಪ್ರದಾಯ. ಭತ್ತದ ಕೊಯ್ಲು ಮುಗಿದ ನಂತರ ಈ ಉತ್ಸವ ನಡೆಯುತ್ತದೆ.",
        roman: "karnaaTakada karaavaLi bhaagavaada mangaLuuru mattu uDupiyalli kambaLa ondu prasiddha jaanapada sampradaaya. bhattada koylu mugida nantara ii utsava naDeyuttade.",
        meaning: "In Karnataka's coastal regions of Mangaluru and Udupi, Kambala is a famous folk tradition. This festival takes place after the paddy harvest is complete.",
      },
      {
        script: "ನೀರು ತುಂಬಿದ ಉದ್ದವಾದ ಗದ್ದೆಯಲ್ಲಿ ರೈತರು ತಮ್ಮ ಎಮ್ಮೆಗಳನ್ನು ಹೂವು ಮತ್ತು ಹಿತ್ತಾಳೆ ಆಭರಣಗಳಿಂದ ಅಲಂಕರಿಸುತ್ತಾರೆ. ಊರಿನ ಎಲ್ಲ ಜನರು ಗದ್ದೆಯ ಸುತ್ತಲೂ ಸೇರುತ್ತಾರೆ.",
        roman: "niiru tumbida uddavaada gaddeyalli raitaru tamma emmegaLannu huuvu mattu hittaaLe aabharaNagaLinda alankarisuttaare. uurina ella janaru gaddeya suttaluu seeruttaare.",
        meaning: "At the long water-filled paddy track, farmers decorate their buffaloes with flowers and brass ornaments. People from the whole village gather around the field.",
      },
      {
        script: "ವಾದ್ಯಗಳ ಸದ್ದು, ಜನರ ಚಪ್ಪಾಳೆ ಮತ್ತು ಹರ್ಷೋದ್ಗಾರಗಳಿಂದ ಇಡೀ ಊರು ಹಬ್ಬದ ವಾತಾವರಣದಿಂದ ತುಂಬಿರುತ್ತದೆ. ಇದು ಭೂಮಿ ಮತ್ತು ಪ್ರಕೃತಿಗೆ ಕೃತಜ್ಞತೆ ಸಲ್ಲಿಸುವ ಸಮಯ.",
        roman: "vaadyagaLa saddu, janara chappaaLe mattu harShoodgaaragaLinda iDii uuru habbada vaataavaraNadinda tumbiruttade. idu bhuumi mattu prakRutige kRutajnate sllisuva samaya.",
        meaning: "With the sound of drums, clapping, and cheers, the whole town fills with festive energy. It is a time to offer gratitude to the earth and nature.",
      },
      {
        script: "ಕರಾವಳಿಯ ಜನರ ಪ್ರೀತಿ, ನೀರ್ ದೋಸೆ ಮತ್ತು ತೆಂಗಿನಕಾಯಿ ಅಡುಗೆಗಳು ಈ ಉತ್ಸವದ ಸೊಬಗನ್ನು ಇನ್ನಷ್ಟು ಹೆಚ್ಚಿಸುತ್ತವೆ.",
        roman: "karaavaLiya janara priiti, niir doose mattu tenginakaayi aDugegaLu ii utsavada sobagannu innaShTu hechchisuttave.",
        meaning: "The warmth of coastal people, neer dose, and coconut dishes add even more charm to this celebration.",
      },
    ],
    glossary: [
      { script: "ಕರಾವಳಿ", roman: "karaavaLi", meaning: "Coast / shoreline" },
      { script: "ಗದ್ದೆ", roman: "gadde", meaning: "Paddy field" },
      { script: "ಭೂಮಿ", roman: "bhuumi", meaning: "Earth" },
      { script: "ತೆಂಗಿನಕಾಯಿ", roman: "tenginakaayi", meaning: "Coconut" },
      { script: "ಉತ್ಸವ", roman: "utsava", meaning: "Celebration / festival" },
    ],
    references: [
      "Region: Dakshina Kannada & Udupi (Karavali)",
      "Season: November to March (post-harvest)",
    ],
    postcardArt: "konkan",
  },

  // ───────────────── MUSIC (4) ─────────────────
  {
    id: "kn.her.purandara",
    category: "music",
    region: "Hampi & Pandharpur · 16th Century",
    title: "Purandara Dasa — Father of Carnatic Music",
    titleScript: "ಪುರಂದರ ದಾಸರು",
    titleRoman: "purandara daasaru",
    summary: "The wandering saint-composer who codified the beginner lessons of South Indian classical music in Kannada.",
    story:
      "Revered as Karnataka Sangeetha Pitamaha, Purandara Dasa composed thousands of soulful Kannada songs and created the foundational Sarali Varase exercises still taught today.",
    keyTerm: { script: "ಕರ್ನಾಟಕ ಸಂಗೀತ", roman: "karnaaTaka sangiita", meaning: "Carnatic classical music" },
    paragraphs: [
      {
        script: "ಪುರಂದರ ದಾಸರನ್ನು 'ಕರ್ನಾಟಕ ಸಂಗೀತ ಪಿತಾಮಹ' ಎಂದು ಗೌರವದಿಂದ ಕರೆಯುತ್ತಾರೆ. ಅವರು ಹದಿನಾರನೆಯ ಶತಮಾನದಲ್ಲಿ ಕನ್ನಡದಲ್ಲಿ ಸಾವಿರಾರು ಸುಂದರ ಕೀರ್ತನೆಗಳನ್ನು ರಚಿಸಿದರು.",
        roman: "purandara daasarannu 'karnaaTaka sangiita pitaamaha' endu gauravadinda kareyuttaare. avaru hadinaaraneya shatamaanadalli kannaDadalli saaviraaru sundara kiirtanegaLannu rachisidaru.",
        meaning: "Purandara Dasa is respectfully called the 'Grandfather of Carnatic Music'. In the sixteenth century, he composed thousands of beautiful devotional songs in Kannada.",
      },
      {
        script: "ಮೊದಲು ಶ್ರೀನಿವಾಸ ನಾಯಕ ಎಂಬ ಶ್ರೀಮಂತ ವ್ಯಾಪಾರಿಯಾಗಿದ್ದ ಅವರು, ನಂತರ ಎಲ್ಲವನ್ನೂ ತ್ಯಜಿಸಿ ತಂಬೂರಿ ಹಿಡಿದು ಊರೂರು ತಿರುಗಿ ಹಾಡಿದರು.",
        roman: "modalu shriinivaasa naayaka emba shriimanta vyaapaariyaagidda avaru, nantara ellavannuu tyajisi tambuuri hiDidu uuruuru tirugi haaDidaru.",
        meaning: "Once a wealthy merchant named Srinivasa Nayaka, he later gave up everything and wandered from town to town singing with a tambura in hand.",
      },
      {
        script: "ಹೊಸದಾಗಿ ಸಂಗೀತ ಕಲಿಯುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ ಅವರು ಸರಳೀ ವರಸೆ ಮತ್ತು ಗೀತೆಗಳನ್ನು ರೂಪಿಸಿದರು. ಇಂದಿಗೂ ಪ್ರತಿ ಸಂಗೀತ ವಿದ್ಯಾರ್ಥಿ ಅವರ ಪಾಠದಿಂದಲೇ ಆರಂಭಿಸುತ್ತಾನೆ.",
        roman: "hosadaagi sangiita kaliyuva vidyaarthigaLigaagi avaru saraLii varase mattu giitegaLannu ruupisidaru. indiguu prati sangiita vidyaarthi avara paaThadindalee aarambhisuttaane.",
        meaning: "For new music students, he designed the foundational Sarali Varase exercises and songs. Even today, every Carnatic music student begins with his lessons.",
      },
      {
        script: "'ಭಾಗ್ಯದ ಲಕ್ಷ್ಮೀ ಬಾರಮ್ಮ' ಮತ್ತು 'ಕೃಷ್ಣಾ ನೀ ಬೇಗನೆ ಬಾರೋ' ಅವರ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ಹಾಡುಗಳು. ಅವರ ಹಾಡುಗಳಲ್ಲಿ ಸರಳ ಕನ್ನಡ ಮತ್ತು ಆಳವಾದ ಭಕ್ತಿ ಇದೆ.",
        roman: "'bhaagyada lakShmii baaramma' mattu 'kRushNaa nii beegane baaroo' avara atyanta prasiddha haaDugaLu. avara haaDugaLalli saraLa kannaDa mattu aaLavaada bhakti ide.",
        meaning: "'Bhagyada Lakshmi Baramma' and 'Krishna Nee Begane Baro' are his most famous songs. His songs blend simple Kannada with deep devotion.",
      },
    ],
    glossary: [
      { script: "ಹಾಡು", roman: "haaDu", meaning: "Song" },
      { script: "ಪಾಠ", roman: "paaTha", meaning: "Lesson" },
      { script: "ವಿದ್ಯಾರ್ಥಿ", roman: "vidyaarthi", meaning: "Student" },
      { script: "ಸಂಗೀತ", roman: "sangiita", meaning: "Music" },
      { script: "ಭಕ್ತಿ", roman: "bhakti", meaning: "Devotion" },
    ],
    references: [
      "Listen: Bhagyada Lakshmi Baramma (Raga Sri)",
      "Listen: Jagadodharana (Raga Kapi)",
      "Listen: Krishna Nee Begane Baro (Raga Yamuna Kalyani)",
    ],
    postcardArt: "udupi",
  },
  {
    id: "kn.her.bhavageethe",
    category: "music",
    region: "Bengaluru & Mysuru",
    title: "Sugama Sangeetha & Bhavageethe",
    titleScript: "ಸುಗಮ ಸಂಗೀತ ಮತ್ತು ಭಾವಗೀತೆ",
    titleRoman: "sugama sangiita mattu bhaavagiite",
    summary: "Karnataka's cherished 'emotion-song' genre that brings modern Kannada poetry to life with unforgettable melodies.",
    story:
      "Unique to Karnataka, Bhavageethe sets lyrical poems by Kuvempu, Bendre, and Nisar Ahmed to intimate melodies that families still sing together on rainy evenings.",
    keyTerm: { script: "ಭಾವಗೀತೆ", roman: "bhaavagiite", meaning: "Poetry set to expressive melody" },
    paragraphs: [
      {
        script: "ಭಾವಗೀತೆ ಎಂದರೆ ಕವಿತೆಯ ಭಾವನೆಯನ್ನು ಸುಂದರ ರಾಗದಲ್ಲಿ ಹಾಡುವ ಕಲೆ. ಕರ್ನಾಟಕದ ಮನೆಮನೆಗಳಲ್ಲಿ ಈ ಸುಗಮ ಸಂಗೀತಕ್ಕೆ ವಿಶೇಷ ಸ್ಥಾನವಿದೆ.",
        roman: "bhaavagiite endare kaviteya bhaavaneyannu sundara raagadalli haaDuva kale. karnaaTakada manemanegaLalli ii sugama sangiitakke visheeSha sthaanavide.",
        meaning: "Bhavageethe is the art of singing the emotion of a poem in a beautiful melody. In homes across Karnataka, this light music holds a special place.",
      },
      {
        script: "ಕುವೆಂಪು, ದ. ರಾ. ಬೇಂದ್ರೆ, ಕೆ. ಎಸ್. ನರಸಿಂಹಸ್ವಾಮಿ ಮತ್ತು ನಿಸಾರ್ ಅಹಮದ್ ಅವರ ಕವಿತೆಗಳು ಭಾವಗೀತೆಗಳಾಗಿ ಜನರ ಮನಸ್ಸನ್ನು ಗೆದ್ದವು.",
        roman: "kuvempu, da. raa. beendre, ke. es. narasimhasvaami mattu nisaar ahamad avara kavitegaLu bhaavagiitegaLaagi janara manassannu geddavu.",
        meaning: "Poems by Kuvempu, Da. Ra. Bendre, K. S. Narasimhaswamy, and Nisar Ahmed won people's hearts as Bhavageethe songs.",
      },
      {
        script: "ಪಿ. ಕಾಳಿಂಗರಾವ್, ಮೈಸೂರು ಅನಂತಸ್ವಾಮಿ ಮತ್ತು ಸಿ. ಅಶ್ವತ್ಥ್ ಈ ಹಾಡುಗಳಿಗೆ ಮಧುರವಾದ ಸಂಗೀತ ಸಂಯೋಜಿಸಿದರು. 'ನಿತ್ಯೋತ್ಸವ' ಹಾಡು ಇಂದಿಗೂ ಕರ್ನಾಟಕದ ಪ್ರತಿ ಉತ್ಸವದಲ್ಲಿ ಮೊಳಗುತ್ತದೆ.",
        roman: "pi. kaaLingaraav, maisuuru anantasvaami mattu si. ashvatth ii haaDugaLige madhuravaada sangiita samyoojisidaru. 'nityootsava' haaDu indiguu karnaaTakada prati utsavadalli moLaguttade.",
        meaning: "P. Kalinga Rao, Mysore Ananthaswamy, and C. Ashwath composed sweet melodies for these poems. The song 'Nityotsava' still rings out at every Karnataka celebration.",
      },
      {
        script: "ಮಳೆ ಬರುವ ಸಂಜೆ ಬಿಸಿ ಕಾಫಿಯೊಂದಿಗೆ ಭಾವಗೀತೆ ಕೇಳುವುದು ಕನ್ನಡಿಗರ ಪ್ರೀತಿಯ ಅಭ್ಯಾಸ. ಕವಿತೆ ಮತ್ತು ಸಂಗೀತ ಒಂದಾದಾಗ ಕನ್ನಡ ಇನ್ನಷ್ಟು ಮಧುರವಾಗಿ ಕೇಳಿಸುತ್ತದೆ.",
        roman: "maLe baruva sanje bisi kaafiyondige bhaavagiite keeLuvudu kannaDigara priitiya abhyaasa. kavite mattu sangiita ondaadaaga kannaDa innaShTu madhuravaagi keeLisuttade.",
        meaning: "Listening to Bhavageethe with hot coffee on a rainy evening is a beloved habit of Kannadigas. When poetry and music unite, Kannada sounds even sweeter.",
      },
    ],
    glossary: [
      { script: "ಕವಿತೆ", roman: "kavite", meaning: "Poem" },
      { script: "ಭಾವನೆ", roman: "bhaavane", meaning: "Emotion / feeling" },
      { script: "ಮಧುರ", roman: "madhura", meaning: "Sweet / melodious" },
      { script: "ಸಂಜೆ", roman: "sanje", meaning: "Evening" },
      { script: "ಮನಸ್ಸು", roman: "manassu", meaning: "Mind / heart" },
    ],
    references: [
      "Listen: Nityotsava — K. S. Nisar Ahmed / Mysore Ananthaswamy",
      "Listen: Yava Mohana Murali — Gopalakrishna Adiga / C. Ashwath",
      "Listen: Baaro Sadhanakerige — Da. Ra. Bendre",
    ],
    postcardArt: "bengaluru",
  },
  {
    id: "kn.her.dharwad",
    category: "music",
    region: "Dharwad · Hubballi",
    title: "The Hindustani Soul of Dharwad",
    titleScript: "ಧಾರವಾಡದ ಸಂಗೀತ ಪರಂಪರೆ",
    titleRoman: "dhaaravaaDada sangiita parampare",
    summary: "How one quiet town in northern Karnataka became a cradle for India's greatest Hindustani vocalists.",
    story:
      "Dharwad's red-earth hills nurtured Bharat Ratna Pandit Bhimsen Joshi, Gangubai Hangal, and Mallikarjun Mansur — making North Karnataka a living sanctuary of raga.",
    keyTerm: { script: "ರಾಗ ಮತ್ತು ತಾಳ", roman: "raaga mattu taaLa", meaning: "Melody and rhythm" },
    paragraphs: [
      {
        script: "ಉತ್ತರ ಕರ್ನಾಟಕದ ಧಾರವಾಡ ನಗರವನ್ನು 'ಸಂಗೀತ ಮತ್ತು ಸಾಹಿತ್ಯದ ತವರು' ಎಂದು ಕರೆಯುತ್ತಾರೆ. ಇಲ್ಲಿನ ಶಾಂತ ವಾತಾವರಣ ಅನೇಕ ಮಹಾನ್ ಗಾಯಕರನ್ನು ರೂಪಿಸಿದೆ.",
        roman: "uttara karnaaTakada dhaaravaaDa nagaravannu 'sangiita mattu saahityada tavaru' endu kareyuttaare. illina shaanta vaataavaraNa aneeka mahaan gaayakarannu ruupiside.",
        meaning: "Dharwad in North Karnataka is called the 'home of music and literature'. Its peaceful atmosphere has shaped many great singers.",
      },
      {
        script: "ಭಾರತ ರತ್ನ ಪಂಡಿತ್ ಭೀಮಸೇನ ಜೋಶಿ, ಗಂಗೂಬಾಯಿ ಹಾನಗಲ್ ಮತ್ತು ಮಲ್ಲಿಕಾರ್ಜುನ ಮನ್ಸೂರ್ ಈ ನಾಡಿನ ಹೆಮ್ಮೆಯ ಕಲಾವಿದರು. ಅವರ ಧ್ವನಿ ಇಡೀ ಭಾರತದಾದ್ಯಂತ ಮನೆಮಾತಾಯಿತು.",
        roman: "bhaarata ratna paNDit bhiimaseena jooshi, ganguubaayi haanagal mattu mallikaarjuna mansuur ii naaDina hemmeya kalaavidaru. avara dhvani iDii bhaaratadaadyanta manemaataayitu.",
        meaning: "Bharat Ratna Pandit Bhimsen Joshi, Gangubai Hangal, and Mallikarjun Mansur are proud artists of this land. Their voices became household names across India.",
      },
      {
        script: "ಇಲ್ಲಿನ ಗಾಯಕರು ಹಿಂದೂಸ್ತಾನಿ ರಾಗಗಳ ಜೊತೆಗೆ ಕನ್ನಡದ ದಾಸರ ಪದಗಳು ಮತ್ತು ವಚನಗಳನ್ನೂ ಭಾವಪೂರ್ಣವಾಗಿ ಹಾಡಿದರು. ರಾಗ ಮತ್ತು ತಾಳದ ಸುಂದರ ಸಂಗಮ ಇಲ್ಲಿ ಕಾಣಸಿಗುತ್ತದೆ.",
        roman: "illina gaayakaru hinduustaani raagagaLa jotege kannaDada daasara padagaLu mattu vachanagaLannuu bhaavapuurNavaagi haaDidaru. raaga mattu taaLada sundara sangama illi kaaNasiguttade.",
        meaning: "Singers here sang Kannada Dasa padas and Vachanas with deep feeling alongside Hindustani ragas. A beautiful union of melody and rhythm is found here.",
      },
      {
        script: "ಇಂದಿಗೂ ಧಾರವಾಡದ ಸಂಗೀತ ಸಭೆಗಳಲ್ಲಿ ಹೊಸ ತಲೆಮಾರಿನ ಕಲಾವಿದರು ಈ ಶ್ರೀಮಂತ ಪರಂಪರೆಯನ್ನು ಮುಂದುವರಿಸುತ್ತಿದ್ದಾರೆ.",
        roman: "indiguu dhaaravaaDada sangiita sabhegaLalli hosa talemaarina kalaavidaru ii shriimanta parampareyannu munduvarisuttiddaare.",
        meaning: "Even today, a new generation of artists carries forward this rich tradition in Dharwad's music halls.",
      },
    ],
    glossary: [
      { script: "ಗಾಯಕ", roman: "gaayaka", meaning: "Singer" },
      { script: "ಧ್ವನಿ", roman: "dhvani", meaning: "Voice / sound" },
      { script: "ರಾಗ", roman: "raaga", meaning: "Melody / raga" },
      { script: "ತಾಳ", roman: "taaLa", meaning: "Rhythm / beat" },
      { script: "ಪರಂಪರೆ", roman: "parampare", meaning: "Tradition / heritage" },
    ],
    references: [
      "Listen: Bhimsen Joshi — Bhagyada Lakshmi Baramma",
      "Listen: Gangubai Hangal — Raga Bhairavi",
      "Listen: Mallikarjun Mansur — Vachana renditions",
    ],
    postcardArt: "badami",
  },
  {
    id: "kn.her.janapada",
    category: "music",
    region: "Rural Karnataka",
    title: "Janapada Geethe & Dollu Kunitha",
    titleScript: "ಜಾನಪದ ಗೀತೆ ಮತ್ತು ಡೊಳ್ಳು ಕುಣಿತ",
    titleRoman: "jaanapada giite mattu DoLLu kuNita",
    summary: "Joyful village folk songs, harvest rhythms, and the thunderous drum dance of Dollu Kunitha.",
    story:
      "Passed down orally from mothers and farmers for centuries, Karnataka's Janapada folk songs and thunderous Dollu Kunitha drum dances celebrate everyday life, harvest, and community.",
    keyTerm: { script: "ಜಾನಪದ", roman: "jaanapada", meaning: "Folk culture / people's lore" },
    paragraphs: [
      {
        script: "ಕರ್ನಾಟಕದ ಹಳ್ಳಿಗಳಲ್ಲಿ ಹಿರಿಯರಿಂದ ಕಿರಿಯರಿಗೆ ಬಾಯಿಂದ ಬಾಯಿಗೆ ಹರಿದು ಬಂದ ಹಾಡುಗಳೇ ಜಾನಪದ ಗೀತೆಗಳು. ಹೊಲದಲ್ಲಿ ಕೆಲಸ ಮಾಡುವಾಗ ಮತ್ತು ಹಬ್ಬಗಳಲ್ಲಿ ಜನರು ಇವುಗಳನ್ನು ಹಾಡುತ್ತಾರೆ.",
        roman: "karnaaTakada haLLigaLalli hiriyarinda kiriyarige baayinda baayige haridu banda haaDugaLee jaanapada giitegaLu. holadalli kelasa maaDuvaaga mattu habbagaLalli janaru ivugaLannu haaDuttaare.",
        meaning: "Songs passed down orally from elders to youth in Karnataka's villages are Janapada Geethe. People sing them while working in the fields and during festivals.",
      },
      {
        script: "ರಾಗಿ ಬೀಸುವ ಪದ, ಸೋಬಾನೆ ಪದ ಮತ್ತು ಲಾವಣಿಗಳು ಕನ್ನಡ ಜಾನಪದದ ಸಿರಿವಂತಿಕೆಯನ್ನು ತೋರಿಸುತ್ತವೆ. ಇವುಗಳಲ್ಲಿ ಹಳ್ಳಿಯ ಬದುಕು, ಪ್ರೀತಿ ಮತ್ತು ಪ್ರಕೃತಿಯ ಸೊಬಗು ಇರುತ್ತದೆ.",
        roman: "raagi biisuva pada, soobaane pada mattu laavaNigaLu kannaDa jaanapadada sirivantibeyannu toorisuttave. ivugaLalli haLLiya baduku, priiti mattu prakRutiya sobagu iruttade.",
        meaning: "Ragi-grinding songs, Sobane wedding songs, and Lavani ballads show the richness of Kannada folklore. They capture village life, love, and nature's beauty.",
      },
      {
        script: "ಡೊಳ್ಳು ಕುಣಿತ ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ಉತ್ಸಾಹಭರಿತ ಜಾನಪದ ನೃತ್ಯ. ದೊಡ್ಡ ಡೊಳ್ಳನ್ನು ಕಟ್ಟಿಕೊಂಡ ಕಲಾವಿದರು ಒಂದೇ ಲಯದಲ್ಲಿ ಕುಣಿಯುತ್ತಾ ಡೊಳ್ಳು ಬಾರಿಸುತ್ತಾರೆ.",
        roman: "DoLLu kuNita karnaaTakada atyanta utsaahabharita jaanapada nRutya. doDDa DoLLannu kaTTikoNDa kalaavidaru ondee layadalli kuNiyuttaa DoLLu baarisuttaare.",
        meaning: "Dollu Kunitha is Karnataka's most energetic folk dance. Wearing large drums tied to their waists, performers dance and beat the drums in perfect rhythm.",
      },
      {
        script: "ರಾಮನಗರದ ಜಾನಪದ ಲೋಕದಲ್ಲಿ ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ಜಾನಪದ ಕಲೆಗಳು ಮತ್ತು ವಾದ್ಯಗಳನ್ನು ನೋಡಬಹುದು. ಜಾನಪದವು ನಮ್ಮ ಮಣ್ಣಿನ ನಿಜವಾದ ಧ್ವನಿ.",
        roman: "raamanagarada jaanapada lookadalli karnaaTakada ellaa jaanapada kalegaLu mattu vaadyagaLannu nooDabahudu. jaanapadavu namma maNNina nijavaada dhvani.",
        meaning: "At Janapada Loka in Ramanagara, you can see all of Karnataka's folk arts and instruments. Folklore is the true voice of our soil.",
      },
    ],
    glossary: [
      { script: "ನೃತ್ಯ", roman: "nRutya", meaning: "Dance" },
      { script: "ಡೊಳ್ಳು", roman: "DoLLu", meaning: "Folk drum" },
      { script: "ಹೊಲ", roman: "hola", meaning: "Field / farm" },
      { script: "ಬದುಕು", roman: "baduku", meaning: "Life / living" },
      { script: "ಮಣ್ಣು", roman: "maNNu", meaning: "Soil / earth" },
    ],
    references: [
      "Visit: Janapada Loka, Ramanagara",
      "Folk forms: Dollu Kunitha, Veeragase, Kamsale, Sobane Pada",
    ],
    postcardArt: "jog",
  },

  // ───────────────── ART & CRAFT (4) ─────────────────
  {
    id: "kn.her.yakshagana",
    category: "art",
    region: "Coastal Karnataka & Malnad",
    title: "Yakshagana — Theatre of the Night",
    titleScript: "ಯಕ್ಷಗಾನ",
    titleRoman: "yakshagaana",
    summary: "Towering golden crowns, thunderous chande drums, and improvised mythic drama under starlit skies.",
    story:
      "Meaning 'song of the celestial beings', Yakshagana fuses vivid face painting, towering wooden crowns, footwork, and improvised Kannada dialogue from dusk till dawn.",
    keyTerm: { script: "ಭಾಗವತ", roman: "bhaagavata", meaning: "Lead storyteller-singer of Yakshagana" },
    paragraphs: [
      {
        script: "ಯಕ್ಷಗಾನ ಕರ್ನಾಟಕದ ಕರಾವಳಿ ಮತ್ತು ಮಲೆನಾಡಿನ ಪ್ರಸಿದ್ಧ ರಂಗಕಲೆ. ಇದರಲ್ಲಿ ನೃತ್ಯ, ಸಂಗೀತ, ಮಾತುಗಾರಿಕೆ ಮತ್ತು ಬಣ್ಣದ ವೇಷಭೂಷಣ ಎಲ್ಲವೂ ಒಟ್ಟಾಗಿ ಸೇರುತ್ತವೆ.",
        roman: "yakShagaana karnaaTakada karaavaLi mattu malenaaDina prasiddha rangakale. idaralli nRutya, sangiita, maatugaarike mattu baNNada veeShabhuuShaNa ellavuu oTTaagi seeruttaave.",
        meaning: "Yakshagana is the famous theatre art of coastal Karnataka and Malnad. Dance, music, dialogue, and colourful costumes all come together in it.",
      },
      {
        script: "ಕಲಾವಿದರು ಮುಖಕ್ಕೆ ಕೆಂಪು, ಹಳದಿ ಮತ್ತು ಹಸಿರು ಬಣ್ಣಗಳನ್ನು ಹಚ್ಚಿ, ತಲೆಗೆ ದೊಡ್ಡ ಚಿನ್ನದ ಕಿರೀಟ ಧರಿಸುತ್ತಾರೆ. ರಾತ್ರಿಯ ಬೆಳಕಿನಲ್ಲಿ ಅವರ ವೇಷ ತುಂಬಾ ಭವ್ಯವಾಗಿ ಕಾಣುತ್ತದೆ.",
        roman: "kalaavidaru mukhakke kempu, haLadi mattu hasiru baNNagaLannu hachchi, talege doDDa chinnada kiriiTa dharisuttaare. raatriya beLakinalli avara veeSha tumbaa bhavyavaagi kaaNuttade.",
        meaning: "Artists paint their faces with red, yellow, and green colours and wear tall golden crowns. Under the night lights, their costumes look truly magnificent.",
      },
      {
        script: "ಭಾಗವತರು ರಾಮಾಯಣ ಮತ್ತು ಮಹಾಭಾರತದ ಕಥೆಗಳನ್ನು ಹಾಡುತ್ತಾರೆ. ಚೆಂಡೆ ಮತ್ತು ಮದ್ದಳೆಯ ಗಂಭೀರ ಸದ್ದಿಗೆ ಕಲಾವಿದರು ವೇಗವಾಗಿ ಕುಣಿಯುತ್ತಾರೆ ಮತ್ತು ತಕ್ಷಣವೇ ಕನ್ನಡದಲ್ಲಿ ಸಂಭಾಷಣೆ ಮಾಡುತ್ತಾರೆ.",
        roman: "bhaagavataru raamaayaNa mattu mahaabhaaratada kathegaLannu haaDuttaare. cheNDe mattu maddaLeya gambhiira saddige kalaavidaru veegavaagi kuNiyuttaare mattu takShaNavee kannaDadalli sambhaaShaNe maaDuttaare.",
        meaning: "The Bhagavata sings stories from the Ramayana and Mahabharata. To the powerful beats of the chande and maddale drums, performers dance swiftly and improvise Kannada dialogue on the spot.",
      },
      {
        script: "ಸಂಜೆಯಿಂದ ಬೆಳಿಗ್ಗೆಯವರೆಗೆ ತೆರೆದ ಬಯಲಿನಲ್ಲಿ ನಡೆಯುವ ಯಕ್ಷಗಾನ ನೋಡುವುದು ಒಂದು ಮರೆಯಲಾಗದ ಅನುಭವ.",
        roman: "sanjeyinda beLiggeyavarege tereda bayalinalli naDeyuva yakShagaana nooDuvudu ondu mareyalaagada anubhava.",
        meaning: "Watching an open-air Yakshagana performance from evening until dawn is an unforgettable experience.",
      },
    ],
    glossary: [
      { script: "ಬಣ್ಣ", roman: "baNNa", meaning: "Colour" },
      { script: "ಕಿರೀಟ", roman: "kiriiTa", meaning: "Crown" },
      { script: "ರಾತ್ರಿ", roman: "raatri", meaning: "Night" },
      { script: "ಕಥೆ", roman: "kathe", meaning: "Story" },
      { script: "ಬೆಳಕು", roman: "beLaku", meaning: "Light" },
    ],
    references: [
      "Styles: Tenkutittu (Southern) & Badagutittu (Northern)",
      "Instruments: Chande, Maddale, Taala, Harmonium",
      "Experience: Open-air Bayalata performances (Nov–May)",
    ],
    postcardArt: "gokarna",
  },
  {
    id: "kn.her.crafts",
    category: "art",
    region: "Channapatna & Bidar",
    title: "Channapatna Toys & Bidriware",
    titleScript: "ಚನ್ನಪಟ್ಟಣದ ಗೊಂಬೆಗಳು",
    titleRoman: "channapaTTaNada gombegaLu",
    summary: "Two iconic GI-tagged Karnataka crafts: vegetable-dyed lacquered wooden toys and silver-inlaid blackened metalwork.",
    story:
      "In Channapatna, artisans turn soft ivory wood into bright natural-dyed toys; in Bidar, master metalworkers inlay pure silver into darkened metal to craft Bidriware.",
    keyTerm: { script: "ಕಲಾಕೃತಿ", roman: "kalaakRuti", meaning: "Handcrafted work of art" },
    paragraphs: [
      {
        script: "ಬೆಂಗಳೂರು ಮತ್ತು ಮೈಸೂರಿನ ನಡುವೆ ಇರುವ ಚನ್ನಪಟ್ಟಣವನ್ನು 'ಗೊಂಬೆಗಳ ಊರು' ಎಂದು ಕರೆಯುತ್ತಾರೆ. ಇಲ್ಲಿನ ಕಲಾವಿದರು ಆಲೆ ಮರದಿಂದ ಸುಂದರವಾದ ಮರದ ಗೊಂಬೆಗಳನ್ನು ತಯಾರಿಸುತ್ತಾರೆ.",
        roman: "bengaLuuru mattu maisuurina naDuve iruva channapaTTaNavannu 'gombegaLa uuru' endu kareyuttaare. illina kalaavidaru aale maradinda sundaravaada marada gombegaLannu tayaarisuttaare.",
        meaning: "Channapatna, located between Bengaluru and Mysuru, is called the 'Town of Toys'. Artisans here craft beautiful wooden toys from soft ivory wood.",
      },
      {
        script: "ಈ ಗೊಂಬೆಗಳಿಗೆ ಅರಿಶಿನ, ಕುಂಕುಮ ಮತ್ತು ನೀಲಿಯಂತಹ ನೈಸರ್ಗಿಕ ಬಣ್ಣಗಳನ್ನು ಬಳಸುತ್ತಾರೆ. ಆದ್ದರಿಂದ ಚಿಕ್ಕ ಮಕ್ಕಳು ಆಟವಾಡಲು ಇವು ತುಂಬಾ ಸುರಕ್ಷಿತ ಮತ್ತು ಪರಿಸರ ಸ್ನೇಹಿ.",
        roman: "ii gombegaLige arishina, kumkuma mattu niiliyantaha naisargika baNNagaLannu baLasuttaare. aaddarinda chikka makkaLu aaTavaaDalu ivu tumbaa surakShita mattu parisara sneehi.",
        meaning: "Natural colours like turmeric, kumkuma, and indigo are used on these toys. That is why they are completely safe for young children and eco-friendly.",
      },
      {
        script: "ಉತ್ತರ ಕರ್ನಾಟಕದ ಬೀದರ್ ನಗರವು 'ಬಿದರಿ ಕಲೆ'ಗೆ ಪ್ರಸಿದ್ಧವಾಗಿದೆ. ಇಲ್ಲಿನ ಕುಶಲಕರ್ಮಿಗಳು ಕಪ್ಪು ಲೋಹದ ಮೇಲೆ ಶುದ್ಧ ಬೆಳ್ಳಿಯಿಂದ ಸೂಕ್ಷ್ಮವಾದ ಹೂವು ಮತ್ತು ಎಲೆಗಳ ವಿನ್ಯಾಸ ಮಾಡುತ್ತಾರೆ.",
        roman: "uttara karnaaTakada biidar nagaravu 'bidari kale'ge prasiddhavaagide. illina kushalakarmigaLu kappu loohada meele shuddha beLLiyinda suukShmavaada huuvu mattu elegaLa vinyaasa maaDuttaare.",
        meaning: "Bidar in North Karnataka is famous for 'Bidri art'. Master craftspeople here inlay delicate flower and leaf patterns of pure silver onto dark metal.",
      },
      {
        script: "ಚನ್ನಪಟ್ಟಣದ ಗೊಂಬೆಗಳು ಮತ್ತು ಬಿದರಿ ಕಲಾಕೃತಿಗಳು ಕರ್ನಾಟಕದ ಕೈಕಸುಬಿನ ಹಿರಿಮೆಯನ್ನು ಪ್ರಪಂಚಕ್ಕೆ ಪರಿಚಯಿಸಿವೆ.",
        roman: "channapaTTaNada gombegaLu mattu bidari kalaakRutigaLu karnaaTakada kaikasubina hirimeyannu prapanchakke parichayisive.",
        meaning: "Channapatna toys and Bidriware artworks have introduced the greatness of Karnataka's handicrafts to the world.",
      },
    ],
    glossary: [
      { script: "ಊರು", roman: "uuru", meaning: "Town / village" },
      { script: "ಮಕ್ಕಳು", roman: "makkaLu", meaning: "Children" },
      { script: "ಅರಿಶಿನ", roman: "arishina", meaning: "Turmeric" },
      { script: "ಬೆಳ್ಳಿ", roman: "beLLi", meaning: "Silver" },
      { script: "ಕಪ್ಪು", roman: "kappu", meaning: "Black" },
    ],
    references: [
      "Craft: Channapatna Gombegalu (GI-tagged ivory-wood toys)",
      "Craft: Bidriware silver-inlay art of Bidar",
    ],
    postcardArt: "bidar",
  },
  {
    id: "kn.her.hoysala",
    category: "art",
    region: "Belur · Halebidu · Mysuru",
    title: "Hoysala Stone & Mysore Gold Painting",
    titleScript: "ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆ",
    titleRoman: "hoysaLa shilpakale",
    summary: "Lace-like soapstone carvings of dancers and musicians alongside luminous gold-leaf Mysore paintings.",
    story:
      "Hoysala sculptors at Belur and Halebidu carved soapstone with a goldsmith's precision, while Mysore painters perfected luminous gold-leaf art.",
    keyTerm: { script: "ಶಿಲ್ಪಕಲೆ", roman: "shilpakale", meaning: "Sculptural art" },
    paragraphs: [
      {
        script: "ಬೇಲೂರು ಮತ್ತು ಹಳೇಬೀಡಿನ ದೇವಾಲಯಗಳು ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆಯ ಅದ್ಭುತ ಉದಾಹರಣೆಗಳು. ಹನ್ನೊಂದನೆಯ ಶತಮಾನದಲ್ಲಿ ಶಿಲ್ಪಿಗಳು ಮೃದುವಾದ ಬಳಪದ ಕಲ್ಲಿನಲ್ಲಿ ಈ ದೇಗುಲಗಳನ್ನು ಕೆತ್ತಿದರು.",
        roman: "beeluuru mattu haLeebiiDina deevaalayagaLu hoysaLa shilpakaleya adbhuta udaaharaNegaLu. hannondaneya shatamaanadalli shilpigaLu mRuduvaada baLapada kallinalli ii deegulagaLannu kettidaru.",
        meaning: "The temples of Belur and Halebidu are marvellous examples of Hoysala sculpture. In the eleventh century, sculptors carved these shrines in soft soapstone.",
      },
      {
        script: "ಬೇಲೂರಿನ ಚೆನ್ನಕೇಶವ ದೇವಾಲಯದ ಗೋಡೆಗಳ ಮೇಲೆ ನೃತ್ಯ ಮಾಡುವ ಸುಂದರ ಮದನಿಕೆಯರ ಶಿಲ್ಪಗಳಿವೆ. ಅವರ ಕೈಯ ಬಳೆಗಳು ಮತ್ತು ಹೂವಿನ ಹಾರಗಳು ನಿಜವಾದವುಗಳಂತೆ ಕಾಣುತ್ತವೆ.",
        roman: "beeluurina chennakeeshava deevaalayada gooDegaLa meele nRutya maaDuva sundara madanikeyara shilpagaLive. avara kaiya baLegaLu mattu huuvina haaragaLu nijavaadavugaLante kaaNuttave.",
        meaning: "On the walls of Belur's Chennakeshava Temple are graceful Madanika dancer sculptures. The bangles on their wrists and flower garlands look lifelike.",
      },
      {
        script: "ಅದೇ ರೀತಿ ಮೈಸೂರಿನ ಸಾಂಪ್ರದಾಯಿಕ ಚಿತ್ರಕಲೆಯೂ ತುಂಬಾ ಪ್ರಸಿದ್ಧ. ಇದರಲ್ಲಿ ಕಲಾವಿದರು ನೈಸರ್ಗಿಕ ಬಣ್ಣಗಳ ಜೊತೆಗೆ ಶುದ್ಧ ಚಿನ್ನದ ಹಾಳೆಯನ್ನು ಬಳಸಿ ಚಿತ್ರ ಬರೆಯುತ್ತಾರೆ.",
        roman: "adee riiti maisuurina saampradaayika chitrakaleyuu tumbaa prasiddha. idaralli kalaavidaru naisargika baNNagaLa jotege shuddha chinnada haaLeyannu baLasi chitra bareyuttaare.",
        meaning: "Similarly, traditional Mysore painting is very famous. In it, artists paint with natural pigments and pure gold leaf.",
      },
      {
        script: "ಇಂದು ಬೇಲೂರು, ಹಳೇಬೀಡು ಮತ್ತು ಸೋಮನಾಥಪುರದ ಹೊಯ್ಸಳ ದೇವಾಲಯಗಳು ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆಯ ಪಟ್ಟಿಯಲ್ಲಿ ಸ್ಥಾನ ಪಡೆದಿವೆ.",
        roman: "indu beeluuru, haLeebiiDu mattu soomanaathapurada hoysaLa deevaalayagaLu yuneskoo vishva parampareya paTTiyalli sthaana paDedive.",
        meaning: "Today, the Hoysala temples of Belur, Halebidu, and Somanathapura hold a proud place on the UNESCO World Heritage list.",
      },
    ],
    glossary: [
      { script: "ಶಿಲ್ಪಿ", roman: "shilpi", meaning: "Sculptor" },
      { script: "ಗೋಡೆ", roman: "gooDe", meaning: "Wall" },
      { script: "ಚಿನ್ನ", roman: "chinna", meaning: "Gold" },
      { script: "ಚಿತ್ರ", roman: "chitra", meaning: "Painting / picture" },
      { script: "ಸುಂದರ", roman: "sundara", meaning: "Beautiful" },
    ],
    references: [
      "UNESCO World Heritage: Sacred Ensembles of the Hoysalas",
      "Art form: Traditional Mysore Gesso & Gold-Leaf Painting",
      "Sculptures: The 38 Madanikas of Chennakeshava Temple, Belur",
    ],
    postcardArt: "belur",
  },
  {
    id: "kn.her.handloom",
    category: "art",
    region: "Mysuru & Ilkal",
    title: "Mysore Silk & Ilkal Handlooms",
    titleScript: "ಮೈಸೂರು ರೇಷ್ಮೆ ಮತ್ತು ಇಳಕಲ್ ಸೀರೆ",
    titleRoman: "maisuuru reeShme mattu iLakal siire",
    summary: "Luminous golden-bordered Mysore silk and the bold red-bordered Kasuti handlooms of northern Karnataka.",
    story:
      "From the royal looms of Mysuru to the heritage weaving towns of Ilkal and Molakalmuru, Karnataka's handloom weavers turn pure silk and cotton into wearable art.",
    keyTerm: { script: "ಕೈಮಗ್ಗ", roman: "kaimagga", meaning: "Handloom" },
    paragraphs: [
      {
        script: "ಕರ್ನಾಟಕವು ಭಾರತದ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ರೇಷ್ಮೆ ಮತ್ತು ಕೈಮಗ್ಗ ಸೀರೆಗಳಿಗೆ ಹೆಸರುವಾಸಿಯಾಗಿದೆ. ಮೈಸೂರು ರೇಷ್ಮೆ ಸೀರೆಯ ಮೃದುತ್ವ ಮತ್ತು ಚಿನ್ನದ ಅಂಚು ಎಲ್ಲರ ಮನ ಸೆಳೆಯುತ್ತದೆ.",
        roman: "karnaaTakavu bhaaratada atyanta shreeShTha reeShme mattu kaimagga siiregaLige hesaruvaasiyaagide. maisuuru reeShme siireya mRudutva mattu chinnada anchu ellara mana seLeyuttade.",
        meaning: "Karnataka is renowned for some of India's finest silk and handloom sarees. The softness and golden border of Mysore Silk captivate every heart.",
      },
      {
        script: "ಉತ್ತರ ಕರ್ನಾಟಕದ ಇಳಕಲ್ ಊರಿನಲ್ಲಿ ನೇಕಾರರು ತಲೆಮಾರುಗಳಿಂದ ಇಳಕಲ್ ಸೀರೆಗಳನ್ನು ನೇಯುತ್ತಿದ್ದಾರೆ. ಕೆಂಪು ಮತ್ತು ಮರೂನ್ ಬಣ್ಣದ ಪಲ್ಲು ಈ ಸೀರೆಗಳ ವಿಶೇಷ ಗುರುತು.",
        roman: "uttara karnaaTakada iLakal uurinalli neekaararu talemaarugaLinda iLakal siiregaLannu neeyuttiddaare. kempu mattu maruun baNNada pallu ii siiregaLa visheeSha gurutu.",
        meaning: "In the town of Ilkal in North Karnataka, weavers have woven Ilkal sarees for generations. Their red and maroon pallu is a signature mark.",
      },
      {
        script: "ಈ ಸೀರೆಗಳ ಮೇಲೆ ಕಸೂತಿ ಎಂಬ ಸೂಕ್ಷ್ಮ ಕೈಕಸೂತಿ ಕಲೆಯನ್ನು ಮಾಡುತ್ತಾರೆ. ರಥ, ಆನೆ, ನವಿಲು ಮತ್ತು ತುಳಸಿ ಕಟ್ಟೆಯಂತಹ ಸುಂದರ ಚಿತ್ರಗಳನ್ನು ದಾರದಿಂದ ಹೊಲಿಯುತ್ತಾರೆ.",
        roman: "ii siiregaLa meele kasuuti emba suukShma kaikasuuti kaleyannu maaDuttaare. ratha, aane, navilu mattu tuLasi kaTTeyantaha sundara chitragaLannu daaradinda holiyuttaare.",
        meaning: "On these sarees, artisans stitch delicate Kasuti hand embroidery. Beautiful motifs of chariots, elephants, peacocks, and tulasi shrines are sewn with thread.",
      },
      {
        script: "ಪ್ರತಿಯೊಂದು ಕೈಮಗ್ಗ ಸೀರೆಯ ಹಿಂದೆ ನೇಕಾರರ ದಿನಗಳ ಶ್ರಮ ಮತ್ತು ಪ್ರೀತಿ ಇರುತ್ತದೆ. ಹಬ್ಬ ಮತ್ತು ಮದುವೆಗಳಲ್ಲಿ ಈ ಸೀರೆಗಳು ಕರ್ನಾಟಕದ ಸಂಸ್ಕೃತಿಯನ್ನು ಬೆಳಗುತ್ತವೆ.",
        roman: "pratiyondu kaimagga siireya hinde neekaarara dinagaLa shrama mattu priiti iruttade. habba mattu maduvegaLalli ii siiregaLu karnaaTakada samskRutiyannu beLaguttave.",
        meaning: "Behind every handloom saree lie days of a weaver's skill and love. At festivals and weddings, these sarees illuminate Karnataka's culture.",
      },
    ],
    glossary: [
      { script: "ರೇಷ್ಮೆ", roman: "reeShme", meaning: "Silk" },
      { script: "ಸೀರೆ", roman: "siire", meaning: "Saree" },
      { script: "ದಾರ", roman: "daara", meaning: "Thread" },
      { script: "ನವಿಲು", roman: "navilu", meaning: "Peacock" },
      { script: "ಸಂಸ್ಕೃತಿ", roman: "samskRuti", meaning: "Culture" },
    ],
    references: [
      "GI-tagged Crafts: Mysore Silk, Ilkal Saree, Kasuti Embroidery",
      "Weaving centres: Mysuru, Ilkal, Molakalmuru, Udupi",
    ],
    postcardArt: "mullayanagiri",
  },
];

export const KN_HERITAGE: HeritageEntry[] = [...KN_HERITAGE_CORE, ...KN_HERITAGE_MORE];

export const KN_NEWS_FEEDS: NewsFeedSpec[] = [
  {
    id: "oneindia-kn",
    name: "Oneindia ಕನ್ನಡ",
    url: "https://kannada.oneindia.com/rss/feeds/kannada-news-fb.xml",
    tagline: "Daily Karnataka, Bengaluru & culture news",
  },
  {
    id: "tv9-kn",
    name: "TV9 ಕನ್ನಡ",
    url: "https://tv9kannada.com/feed",
    tagline: "Top stories from across Karnataka",
  },
  {
    id: "vk-kn",
    name: "Vijaya Karnataka",
    url: "https://vijaykarnataka.com/rssfeedsdefault.cms",
    tagline: "Karnataka state, city & heritage news",
  },
];
