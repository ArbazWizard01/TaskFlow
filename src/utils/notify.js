import { notification } from "antd";

export const notifySuccess = (title, desc) => {
  notification.success({
    message: title,
    description: desc,
    placement: "topRight",
  });
};

export const notifyError = (title, desc) => {
  notification.error({
    message: title,
    description: desc,
    placement: "topRight",
  });
};

export const notifyInfo = (title, desc) => {
  notification.info({
    message: title,
    description: desc,
    placement: "topRight",
  });
};
