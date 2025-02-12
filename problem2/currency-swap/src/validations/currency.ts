import * as Yup from "yup";

export const currencyValidationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than zero")
    .required("Amount is required"),
});
