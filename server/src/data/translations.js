export const translations = {
  en: {
    welcome: "Welcome to ArenaMind Stadium",
    seatGuidance: "Your seat is in {zone}, Level {level}. Follow the {gate} entrance.",
    nearestFood: "Your nearest food court is {foodCourt}, approximately {distance}m from your seat.",
    emergency: "Emergency assistance is on its way. Stay calm. A volunteer will reach you in {minutes} minutes.",
    lostChild: "A security team has been notified. Your child is at the {location} help desk.",
    announcement: "Attention fans, due to {reason}, please use {alternative}. Thank you for your cooperation.",
  },
  hi: {
    welcome: "एरीनामाइंड स्टेडियम में आपका स्वागत है",
    seatGuidance: "आपकी सीट {zone} में, लेवल {level} पर है। {gate} प्रवेश द्वार से जाएं।",
    nearestFood: "आपका निकटतम फूड कोर्ट {foodCourt} है, जो आपकी सीट से लगभग {distance} मीटर दूर है।",
    emergency: "आपातकालीन सहायता रास्ते पर है। शांत रहें। एक स्वयंसेवक {minutes} मिनट में आप तक पहुंचेगा।",
    lostChild: "सुरक्षा टीम को सूचित कर दिया गया है। आपका बच्चा {location} हेल्प डेस्क पर है।",
    announcement: "प्रिय प्रशंसकों, {reason} के कारण, कृपया {alternative} का उपयोग करें। आपके सहयोग के लिए धन्यवाद।",
  },
  es: {
    welcome: "Bienvenido al Estadio ArenaMind",
    seatGuidance: "Su asiento está en {zone}, Nivel {level}. Siga la entrada {gate}.",
    nearestFood: "Su patio de comidas más cercano es {foodCourt}, aproximadamente a {distance}m de su asiento.",
    emergency: "La asistencia de emergencia está en camino. Mantenga la calma. Un voluntario lo alcanzará en {minutes} minutos.",
    lostChild: "Se ha notificado al equipo de seguridad. Su hijo está en el mostrador de ayuda de {location}.",
    announcement: "Estimados aficionados, debido a {reason}, por favor use {alternative}. Gracias por su cooperación.",
  },
  fr: {
    welcome: "Bienvenue au Stade ArenaMind",
    seatGuidance: "Votre siège est dans {zone}, Niveau {level}. Suivez l'entrée {gate}.",
    nearestFood: "Votre restaurant le plus proche est {foodCourt}, à environ {distance}m de votre siège.",
    emergency: "L'assistance d'urgence est en route. Restez calme. Un bénévole vous rejoindra dans {minutes} minutes.",
    lostChild: "L'équipe de sécurité a été informée. Votre enfant est au bureau d'aide de {location}.",
    announcement: "Chers supporters, en raison de {reason}, veuillez utiliser {alternative}. Merci de votre coopération.",
  },
  ar: {
    welcome: "مرحبًا بكم في استاد أرينامايند",
    seatGuidance: "مقعدك في {zone}، المستوى {level}. اتبع مدخل {gate}.",
    nearestFood: "أقرب مطعم لك هو {foodCourt}، على بعد حوالي {distance} متر من مقعدك.",
    emergency: "المساعدة في حالات الطوارئ في الطريق. حافظ على هدوئك. سيصل إليك متطوع في غضون {minutes} دقيقة.",
    lostChild: "تم إخطار فريق الأمن. طفلك في مكتب المساعدة في {location}.",
    announcement: "عزيزي المشجعين، بسبب {reason}، يرجى استخدام {alternative}. شكرا لتعاونكم.",
  },
  pt: {
    welcome: "Bem-vindo ao Estádio ArenaMind",
    seatGuidance: "Seu assento está em {zone}, Nível {level}. Siga a entrada {gate}.",
    nearestFood: "Seu restaurante mais próximo é {foodCourt}, aproximadamente {distance}m do seu assento.",
    emergency: "A assistência de emergência está a caminho. Mantenha a calma. Um voluntário chegará em {minutes} minutos.",
    lostChild: "A equipe de segurança foi notificada. Seu filho está no balcão de ajuda em {location}.",
    announcement: "Queridos fãs, devido a {reason}, por favor use {alternative}. Obrigado pela sua cooperação.",
  },
};

export function getTranslation(lang, key, params = {}) {
  const langData = translations[lang] || translations.en;
  let template = langData[key] || translations.en[key] || key;
  for (const [k, v] of Object.entries(params)) {
    template = template.replace(`{${k}}`, v);
  }
  return template;
}
