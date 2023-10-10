import { NotificationSchema } from "../types/notification_schema";

const trimStringField = (fieldValue?: string): string => {
  return fieldValue ? fieldValue.trim() : "";
};

export const getTrimmedNotification = (notification: NotificationSchema): NotificationSchema => {
  const {
    name: placeName,
    description: { short: shortDesc, long: longDesc },
    ontology_ids,
    matko_ids,
    extra_keywords,
    notifier: { notifier_type: notifierType, full_name: notifierName, email: notifierEmail, phone: notifierPhone },
    address: {
      fi: { street: streetFi, postal_code: postalCodeFi, post_office: postOfficeFi, neighborhood: neighborhoodFi, neighborhood_id: neighborhoodIdFi },
      sv: { street: streetSv, postal_code: postalCodeSv, post_office: postOfficeSv, neighborhood: neighborhoodSv, neighborhood_id: neighborhoodIdSv },
    },
    location,
    businessid,
    phone,
    email,
    website,
    social_media,
    images,
    comments,
    opening_times,
    organization,
  } = notification;

  return {
    name: {
      fi: trimStringField(placeName.fi),
      sv: trimStringField(placeName.sv),
      en: trimStringField(placeName.en),
    },
    description: {
      short: {
        fi: trimStringField(shortDesc.fi),
        sv: trimStringField(shortDesc.sv),
        en: trimStringField(shortDesc.en),
      },
      long: {
        fi: trimStringField(longDesc.fi),
        sv: trimStringField(longDesc.sv),
        en: trimStringField(longDesc.en),
      },
    },
    ontology_ids,
    matko_ids,
    extra_keywords,
    notifier: {
      notifier_type: trimStringField(notifierType),
      full_name: trimStringField(notifierName),
      email: trimStringField(notifierEmail),
      phone: trimStringField(notifierPhone),
    },
    address: {
      fi: {
        street: trimStringField(streetFi),
        postal_code: trimStringField(postalCodeFi),
        post_office: trimStringField(postOfficeFi),
        neighborhood_id: trimStringField(neighborhoodIdFi),
        neighborhood: trimStringField(neighborhoodFi),
      },
      sv: {
        street: trimStringField(streetSv),
        postal_code: trimStringField(postalCodeSv),
        post_office: trimStringField(postOfficeSv),
        neighborhood_id: trimStringField(neighborhoodIdSv),
        neighborhood: trimStringField(neighborhoodSv),
      },
    },
    location,
    businessid: trimStringField(businessid),
    phone: trimStringField(phone),
    email: trimStringField(email),
    website: {
      fi: trimStringField(website.fi),
      sv: trimStringField(website.sv),
      en: trimStringField(website.en),
    },
    social_media: social_media?.map((item) => {
      const { title, link } = item;
      return { title: trimStringField(title), link: trimStringField(link) };
    }),
    images,
    comments: trimStringField(comments),
    opening_times,
    organization,
  };
};

export default getTrimmedNotification;
