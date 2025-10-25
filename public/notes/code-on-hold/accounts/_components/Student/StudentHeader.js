import { Col, Row } from "antd";
//
import StudentSearch from "./StudentHeaderComponents/StudentSearch";
import StudentTrainingCourseSelect from "./StudentHeaderComponents/StudentTrainingCourseSelect";

const StudentHeader = ({ 
  total, handleFiltersChange, filters 
}) => {
  return (
    <>
      <Row
        justify="space-around"
        align="middle"
        style={{ marginTop: "10px" }}
      >
        <Col
          span={10}
          style={{ display: "flex"}}
        >
          <strong
            style={{
              color: "black",
              alignContent: "center",
            }}
          >
            Search:
          </strong>
          <StudentSearch 
            filters={filters}
            handleFiltersChange={handleFiltersChange}
            />
        </Col>

        <Col
          span={12}
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <strong
            style={{
              color: "black",
              alignContent: "center",
            }}
          >
            Courses
          </strong>
          <StudentTrainingCourseSelect
            total={total}
            selectedCourse={filters.course}
            handleFiltersChange={handleFiltersChange}
          />
        </Col>
      </Row>

      {/* Selected Course info */}
      {/* <Badge
        count={selectedCourse.id}
        overflowCount={999999}
        color="#faad14"
      />
      <span>{`Duration: ${selectedCourse.duration} months`}</span>
      <span>Starts: {formatDate(selectedCourse.startDate)}</span> */}
    </>
  );
};

export default StudentHeader;
