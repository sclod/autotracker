export type ServiceAdvantage = {
  title: string;
  text: string;
};

export type ServiceStep = {
  title: string;
  text: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceTeamMember = {
  name: string;
  role: string;
  phone: string;
};

export type ServiceContent = {
  slug: string;
  title: string;
  summary: string;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButtonLabel?: string;
  };
  advantages: ServiceAdvantage[];
  steps: ServiceStep[];
  faq: ServiceFaq[];
  team: ServiceTeamMember[];
  cta: {
    title: string;
    description: string;
    buttonLabel?: string;
  };
};
