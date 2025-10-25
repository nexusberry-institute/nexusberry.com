import React from "react";

const ViewAttendance = () => {
  return <div>ViewAttendance</div>;
};
export default ViewAttendance;

// import React from 'react';
// import { Alert, Table } from 'antd';
// import { useRouter } from 'next/router';

// import { TagByStatus } from '~/components/attendance/TagByStatus';
// import { IconByMedium } from '~/components/attendance/IconByMedium';

// import students from '~/components/attendance/data/view-students.json';
// import useGetCourseStudentsApi from '~/hooks/useGetCourseStudents';

// export default function ViewAttendance() {
//   const router = useRouter();
//   const { id } = router.query;
//   // console.log("od", router)
//   const { courseStudents, isLoading, isError, error } = useGetCourseStudentsApi(id);
//   console.log(courseStudents);

//   const columns = [
//     {
//       title: 'ID',
//       dataIndex: 'id',
//       key: 'id',
//       sorter: (a, b) => a.id - b.id,
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//       sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//     },
//     {
//       title: "Status",
//       dataIndex: 'status',
//       key: "status",
//       // render: status => <TagByStatus status={status} />,
//       sorter: (a, b) => a.status.toLowerCase().localeCompare(b.status.toLowerCase())
//     },
//     {
//       title: "City",
//       dataIndex: 'city',
//       key: "city",
//       render: medium => <IconByMedium medium={medium} />,
//       sorter: (a, b) => a.medium.toLowerCase().localeCompare(b.medium.toLowerCase())
//     }
//   ];

//   let view;
//   if (isLoading) {
//     view = "";
//   } else if (isError) {
//     view = <Alert message={error.message} type="error" showIcon />;
//     // console.log(error);
//   } else {
//     view = (
//       <>
//         <Table columns={columns} dataSource={courseStudents.students} />
//       </>
//     )
//   }

//   return (
//     <>
//       {view}
//     </>
//   )
// }
