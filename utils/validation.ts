import Ajv from "ajv";
import addFormats from "ajv-formats";
import { NotificationSchema } from "../types/notification_schema";
import notificationSchema from "../schemas/notification_schema.json";

const validateNotificationData = (notification: NotificationSchema): boolean => {
  const ajv = new Ajv();
  addFormats(ajv, ["email", "uri"]);

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
