import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useId } from "react";
import { toast } from "react-hot-toast";

import { addContact } from "../../redux/contacts/operations";
import { useDispatch } from "react-redux";

import css from "./ContactForm.module.css";

// Валідація полів форми
const regex = {
  phoneNumber: /^[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/, // Регулярні вираз для поля форми Number
};

// Об'єкт Yup валідації полів форми
const FeedbackSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  number: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .matches(regex.phoneNumber, "Number format: 000-000-00-00")
    .required("Required"),
});

export default function ContactForm() {
  const dispatch = useDispatch();
  const nameFieldId = useId(); // Створення ідентифікаторів
  const numberFieldId = useId(); // полів форми

  // Початкове значення полів форми
  const initialValues = {
    name: "",
    number: "",
  };

  const handleSubmit = (values, actions) => {
    dispatch(addContact(values))
      .unwrap()
      .then((response) => {
        toast.success("Success!!!");
      })
      .catch((error) => {
        toast.error("Error!!!");
      });
    actions.resetForm();
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={FeedbackSchema}
      >
        <Form className={css.container}>
          <div className={css.inputContainer}>
            <label htmlFor={nameFieldId}>Name</label>
            <Field className={css.inputValue} type="text" name="name" />
            <ErrorMessage className={css.error} name="name" component="span" />
          </div>
          <div className={css.inputContainer}>
            <label htmlFor={numberFieldId}>Number</label>
            <Field
              className={css.inputValue}
              type="tel"
              name="number"
              placeholder="000-000-00-00"
            />
            <ErrorMessage
              className={css.error}
              name="number"
              component="span"
            />
          </div>
          <button className={css.btnAdd} type="submit">
            Add contact
          </button>
        </Form>
      </Formik>
    </>
  );
}
