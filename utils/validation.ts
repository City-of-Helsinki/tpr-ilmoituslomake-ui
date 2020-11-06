import Ajv from "ajv";
import apply from "ajv-formats-draft2019";
import { NotificationSchema } from "../types/notification_schema";
import notificationSchema from "../schemas/notification_schema.json";

const validateNotificationData = (notification: NotificationSchema): boolean => {
  const ajv = new Ajv();
  apply(ajv, { formats: ["idn-email", "iri-reference"] });
  const schema = notificationSchema;
  const validate = ajv.compile<NotificationSchema>(schema);

  const validated = validate(notification);

  if (!validated) {
    // TODO: proper validation error handling
    const errors = validate.errors || [];
    errors.forEach((err) => {
      console.log("validation error -", err.message);
      console.log(err);
    });
  }

  return validated;
};

export default validateNotificationData;
