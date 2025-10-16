import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type toastType = "error" | "default";

const showToast = (text: string, type?: toastType, time?: number) => {
  const toastFn = type === "error" ? toast.error : toast;

  toastFn(text, {
    position: "top-right",
    autoClose: time || 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export default showToast;