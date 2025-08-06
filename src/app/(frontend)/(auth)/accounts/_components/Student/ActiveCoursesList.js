"use client"
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import { Badge, Col, List, Row, Skeleton } from "antd";
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
//
import { formatDate } from "../../lib/formatDate";
//
import useGetTrainingCoursesApi from "../../hooks/Course/useGetTrainingCoursesApi";

const ActiveCoursesList = ({
  handleFiltersChange,
  filters,
  clickedItem,
  setClickedItem,
}) => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");

  // const navigate = useNavigate();
  const navigate = useRouter();

  const {trainingCourses, isLoading, isError, error} = useGetTrainingCoursesApi();
  // console.log("trainingCourses", trainingCourses);

  const handleClick = (id, courseName) => {
    setValue(id);
    setSelectedCourse(courseName);
    if (clickedItem === id) {
      // Item is already clicked, deselect it
      // setClickedItem(null);
      return;
    } else {
      // Item is not clicked, select it
      // setClickedItem(id);
    }
  };

  const handleDeselectCourse = () => {
    let name = "course";
    handleFiltersChange({ name, value: "" });
    setSelectedCourse("");
    // setClickedItem(null);
  };

  useEffect(() => {
    let name = "course";
    if (value) {
      handleFiltersChange({ name, value });
    } else {
      let value = "all";
      handleFiltersChange({ name, value });
    }
  }, [value]);

  useEffect(() => {
    if (trainingCourses?.length > 0) {
      setHasMore(false);
    }
  }, [trainingCourses]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <h4>Selected: {selectedCourse ? selectedCourse : "All"}</h4>
        {selectedCourse ? (
          <CloseCircleOutlined
            onClick={handleDeselectCourse}
            style={{ marginTop: "22px", marginLeft: "2px", cursor: "pointer" }}
          />
        ) : null}
      </div>
      <div
        id="scrollableDiv"
        style={{
          height: "100%",
          overflow: "auto",
          padding: "0 16px",
          backgroundColor: "#fff",
          border: "1px solid rgba(140, 140, 140, 0.35)",
          marginRight: "5px",
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          // next={loadMoreData}
          hasMore={hasMore}
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          // scrollableTarget="scrollableDiv"
        >
          <List
            header={
              <div>
                <strong>
                  Active Courses: {trainingCourses?.length}
                </strong>
              </div>
            }
            dataSource={trainingCourses}
            renderItem={(item) =>
              isLoading ? (
                <Skeleton
                  avatar
                  paragraph={{
                    rows: 1,
                  }}
                  active
                />
              ) : (
                <List.Item
                  key={item?.id}
                  style={{
                    backgroundColor: clickedItem === item.id ? "#f5f5f5" : "",
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Row style={{ marginLeft: "5px" }} gutter={3}>
                        <Col>
                          <Badge
                            count={item?.id}
                            overflowCount={999999}
                            color="#faad14"
                          />
                        </Col>
                        <Col>
                          <strong
                            className="hoverable-strong"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleClick(item.id, item.nick);
                            }}
                          >
                            {item?.nick}
                          </strong>
                        </Col>
                        <Col>
                          <ExclamationCircleOutlined
                            onClick={() =>
                              navigate.push(
                                `/mark-attendance?course-nick=${item?.nick}`
                              )
                            }
                          />
                        </Col>
                      </Row>
                    }
                    description={
                      <>
                        <Row
                          style={{ marginLeft: "5px", marginTop: "-5px" }}
                          gutter={25}
                        >
                          <Col>{`Duration: ${item?.duration} months`}</Col>
                          <Col>Starts: {formatDate(item?.startDate)}</Col>

                          <Col>{`Lectures Covered: ${
                            item?.courseAttendances?.data
                              ? item.courseAttendances.data?.length
                              : 0
                          }`}</Col>
                        </Row>
                        {/* <br /> */}
                        <Row
                          style={{ marginLeft: "5px", marginTop: "-5px" }}
                          gutter={25}
                        >
                          <Col>{`Total Students: ${item?.students?.data?.length}`}</Col>
                          <Col>{`Studying: `}</Col>
                          <Col>{`Left: `}</Col>
                        </Row>
                      </>
                    }
                  />
                </List.Item>
              )
            }
          />
        </InfiniteScroll>
      </div>
    </>
  );
};
export default ActiveCoursesList;
