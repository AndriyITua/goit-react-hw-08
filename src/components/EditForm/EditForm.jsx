import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RiSaveLine } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";
import { useId } from "react";
import { toast } from "react-hot-toast";

// import { addContact } from "../../redux/contacts/operations";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentContact } from "../../redux/contacts/selectors";
import { addCurrentContact } from "../../redux/contacts/slice";

import css from "./EditForm.module.css";
import { editContact } from "../../redux/contacts/operations";

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

export default function EditForm() {
  const nameFieldId = useId(); // Створення ідентифікаторів
  const numberFieldId = useId(); // полів форми

  const dispatch = useDispatch();
  const curentContact = useSelector(selectCurrentContact);
  const handleClose = () => dispatch(addCurrentContact(null));

  // Початкове значення полів форми
  const initialValues = {
    name: curentContact.name,
    number: curentContact.number,
  };

  const curentContactId = curentContact.id;

  const handleSubmit = (values, actions) => {
    dispatch(editContact({ curentContactId, values }))
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
          <div className={css.btnContainer}>
            <button className={css.btnSave} type="submit">
              <RiSaveLine className={css.saveIcon} size={20} />
            </button>
            <button className={css.closeBtn}>
              <MdOutlineCancel
                className={css.closeIcon}
                size={20}
                onClick={handleClose}
              />
            </button>
          </div>
        </Form>
      </Formik>
    </>
  );
}
