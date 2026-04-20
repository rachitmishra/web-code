import React from 'react';
import CinematicHero from '../../../components/ui/Hero/CinematicHero';
import { useHomeContext } from '../../../pages/Home/Context';

const CinematicHeroPlugin: React.FC = () => {
  const { settings, actions } = useHomeContext();

  return (
    <CinematicHero
      title={settings.heroTitle}
      subtitle={settings.heroSubtitle}
      backgroundImage={settings.heroImage}
      ctaText={settings.heroCtaText}
      onCtaClick={actions.scrollToProducts}
    />
  );
};

export default CinematicHeroPlugin;
