import moment from 'moment';
export const leedsTableColumns = [
  {
    title: (
      <div>
        <span style={{ fontWeight: "500px", color: "black", fontSize: "18px", }}>ID</span>
      </div>
    ),
    dataIndex: "id",
    key: 'id',
  },
  {
    title: (
      <div>
        <span style={{ fontWeight: "500px", color: "black", fontSize: "18px" }}>Name</span>
      </div>
    ),
    dataIndex: 'name',
    key: 'name',
    render: (text) => <span>{text}</span>

  },
  {
    title: (
      <div>
        <span style={{ fontWeight: "200px", color: "black", fontSize: "18px" }}>Mobile Number</span>
      </div>
    ),
    dataIndex: 'mobile',
    key: 'mobile',
    width: 200,
  },
  {
    title: (
      <div>
        <span style={{ fontWeight: "500px", color: "black", fontSize: "18px" }}>E-mail</span>
      </div>
    ),
    dataIndex: 'email',
    key: 'email',
    width: 250,

  },
  {
    title: (
      <div>
        <span style={{ fontWeight: "500px", color: "black", fontSize: "18px" }}>Course</span>
      </div>
    ),
    dataIndex: 'webCourseLink',
    key: 'email'
  },
  {
    title: (
      <div>
        <span style={{ fontWeight: "500px", color: "black", fontSize: "18px" }}>Date</span>
      </div>
    ),
    dataIndex: 'createdAt',
    key: 'date',
    render: (date) => moment(date).format('YYYY-MM-DD'),
    width: 250,
  },
];