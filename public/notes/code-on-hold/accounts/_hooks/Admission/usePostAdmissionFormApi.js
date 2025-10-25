import { useMutation } from "react-query";
import axios from "axios";
// import { useAuth } from "~/context/AuthProvider";

// post: student => installments, [admission]
const usePostAdmissionFormApi = () => {
  //   const { state } = useAuth();

  const mutation = useMutation(
    async ({trainingCourse, installments, admission, student}) => {
      const {studentId} = await postStudent(trainingCourse, student);
      await postInstallments(studentId, trainingCourse, installments);
      await postAdmission(studentId, trainingCourse, admission);
      return studentId;
    },
    {
      onSuccess: () => {},
    }
  );

  return mutation;
};


const postStudent = async (trainingCourse, student) => {
  const studentUrl = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/students`;
    
  const res = await axios.post(studentUrl, {
    data: {
      ...student,
      trainingCourses: [trainingCourse],
    },
  });
  
  // console.log("students.res", res);
  res.studentId = res.data.data.id;
  return res;
}

const postInstallments = async (studentId, trainingCourse, installments) => {
  const feeInstallmetUrl = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/fee-Installments`;
    
  // promise.all
    for (let i = 0; i < installments?.length; i++) {
      await axios.post(feeInstallmetUrl, {
        data: {
          student: studentId,
          trainingCourse,
          ...installments[i]
        },
      });
    }
    // console.log("installments success");
}

const postAdmission = async (studentId, trainingCourse, admission = {}) => {
  const studentUrl = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/admissions`;
  
  admission.admissionDate = admission.admissionDate || new Date().toLocaleString();
  
  const res = await axios.post(studentUrl, {
    data: {
      student: studentId,
      trainingCourse,
      admissionDate: new Date()
    },
  });

  // console.log("admission.res: ", res);
  return res;
}

export default usePostAdmissionFormApi;
