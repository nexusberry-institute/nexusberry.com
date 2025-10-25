"use client"
import { Form, message, Spin } from "antd";
import { usePathname } from "next/navigation";
// import { useLocation } from 'react-router-dom';
// custom
import AdmissionForm from "@accounts/_components/Admission/AdmissionForm";
// lib
import { filterFalsyProps } from "@accounts/_lib/utils";
// api
import UseGetTrainingCoursesApi from "@accounts/_hooks/Course/useGetTrainingCoursesApi";
import usePostAdmissionFormApi from "@accounts/_hooks/Admission/usePostAdmissionFormApi";

const formStyle = { padding: "50px 50px 0 50px"};

export default function NewAdmission(){
  const [form] = Form.useForm();
  // const location = useLocation();
  const location = usePathname();
  const queryParams = new URLSearchParams(location.search);

  const id = queryParams.get('id');
  const name = queryParams.get('name');
  const email = queryParams.get('email');
  const mobile = queryParams.get('mobile');
  const city = queryParams.get('city');

  const { trainingCourses } = UseGetTrainingCoursesApi();
  // console.log("trainingCourses", trainingCourses);

  const mutation = usePostAdmissionFormApi();
  // const mutation = usePostFeeInstallmentApi();

const initialValues = {
    name: name || "",
    email: email || "",
    mobile: mobile || "",
  };


  const postNewAdmission = () => {
    form
      .validateFields()
      .then((values) => {
        if(!values.installments.length)
          return message.error("Validation Failed: Missing Installments");

        values = filterFalsyProps(values);
        id && (values.leed = parseInt(id));
        city && (values.city = city);
        
        const {trainingCourse, installments, admission, ...student} = values;
        // console.log(values);
        // console.log({trainingCourse, installments, admission, student});
        
        mutation.mutate(
          {trainingCourse, installments, admission, student},
          {
            onSuccess: (data) => {
              message.success("Admission Success!");
              form.resetFields();
            },
            onError: (error) => {
              message.error(error.msg);
            },
          }
        );
      })
      .catch((errorInfo) => {
        message.error("Validation Failed");
        console.log(errorInfo);
      });
  };

  return (
    <Spin spinning={mutation.isLoading}>
    <Form
      style={formStyle}
      name="dynamic_form_nest_item"
      autoComplete="off"
      form={form}
      initialValues={initialValues}
    >
      
      <AdmissionForm
        postNewAdmission={postNewAdmission}
        trainingCourses={trainingCourses}
      />
    </Form>
    </Spin>
  );
};