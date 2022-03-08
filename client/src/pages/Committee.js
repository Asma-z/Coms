import React, { useRef } from "react";
import { Card } from "antd";
import { Row, Col } from "antd";
import { Input, Avatar, Modal, Form, DatePicker, Select } from "antd";
import MainLayout from "../components/layout";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import ProTable from "@ant-design/pro-table";
import { useDispatch } from "react-redux";
import { colleges } from "../_actions/college_actions";
import {
  committes,
  createCommittee,
  updateCommittee,
} from "../_actions/committee_actions";
import { users } from "../_actions/user_actions";
import moment from "moment";
import { universities } from "../_actions/university_actions";
import { departments } from "../_actions/department_actions";
const { RangePicker } = DatePicker;

function CommitteePage() {
  const actionRef = useRef();
  const [CommitteeForm] = Form.useForm();
  const [Operation, setOperation] = React.useState("Create");
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [collegesData, setCollegesData] = React.useState([]);
  const [usersData, setUsersData] = React.useState([]);
  const [userEditLoading, setUserEditLoading] = React.useState(false);
  const [departmentsData, setDepartmentsData] = React.useState([]);
  const showModal = () => {
    setOperation("Create");
    setVisible(true);
  };
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });
  const dispatch = useDispatch();
  const [universitiesData, setUniversitiesData] = React.useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "subject",
      copyable: true,
      ellipsis: true,
      formItemProps: {
        placeholder: "Search committee",
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "head of committee",
      width: "15%",
      render: (i) => {
        return <p>{i.headOfCommitte.firstName}</p>;
      },
      search: false,
    },
    {
      title: "reporter",
      width: "15%",
      render: (i) => {
        return <p>{i.reporter?.firstName || "-"}</p>;
      },
      search: false,
    },
    {
      title: "Action",
      valueType: "option",
      render: (text, record, _, action) => [
        <Button
          type="link"
          loading={userEditLoading}
          key="editable"
          onClick={() => {
            setUserEditLoading(true);
            dispatch(universities()).then((res) => {
              setUniversitiesData(res.payload.universities);
              dispatch(colleges({ university: record.university?._id })).then(
                (res) => {
                  setCollegesData(res.payload.colleges);
                  dispatch(departments({ college: record.college?._id })).then(
                    (res) => {
                      setDepartmentsData(res.payload.departments);
                      dispatch(users({ college: record.college?._id })).then(
                        (res) => {
                          setUsersData(res.payload.users);
                          CommitteeForm.setFieldsValue({
                            college: record.college?._id,
                            department: record.department?._id,
                            university: record.university?._id,
                            headOfCommittee: record.headOfCommitte?._id,
                            beginEndPeriod: [
                              moment(record.beginPeriod),
                              moment(record.endPeriod),
                            ],
                            subject: record.subject,
                            reporter: record.reporter?._id,
                            _id: record._id,
                          });
                          setOperation("Update");
                          setUserEditLoading(false);
                          setVisible(true);
                        }
                      );
                    }
                  );
                }
              );
            });
          }}
        >
          Edit
        </Button>,
        <Button type="link" color="primary" key="editable" onClick={() => {}}>
          Assign reporter
        </Button>,
        <Button
          type="link"
          target="_blank"
          rel="noopener noreferrer"
          key="view"
        >
          Delete
        </Button>,
      ],
    },
  ];

  return (
    <>
      <MainLayout>
        <Row gutter={0}>
          <Col span={24}>
            <Card>
              <Card.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title="Commitees"
                description="List of all commitees"
              />
            </Card>
          </Col>
          <Col span={24}>
            <ProTable
              columns={columns}
              request={async (params, sort, filter) => {
                const res = await dispatch(committes(params, sort, filter));
                return {
                  data: res.payload.committes,
                  success: res.payload.success,
                  total: res.payload.total,
                };
              }}
              actionRef={actionRef}
              setPagination={setPagination}
              pagination={pagination}
              editable={{
                type: "multiple",
              }}
              rowKey="_id"
              search={{
                labelWidth: "auto",
              }}
              dateFormatter="string"
              toolBarRender={() => [
                <Button
                  onClick={() => {
                    dispatch(universities()).then((res) => {
                      setUniversitiesData(res.payload.universities);
                      showModal();
                    });
                  }}
                  key="button"
                  icon={<PlusOutlined />}
                  type="primary"
                >
                  Create Committee
                </Button>,
              ]}
            />
          </Col>
        </Row>
      </MainLayout>
      <Modal
        title="Create Committee"
        visible={visible}
        onOk={async () => {
          setConfirmLoading(true);
          if (Operation === "Create")
            await dispatch(
              createCommittee({
                subject: CommitteeForm.getFieldValue("subject"),
                beginPeriod: CommitteeForm.getFieldValue("beginEndPeriod")[0],
                endPeriod: CommitteeForm.getFieldValue("beginEndPeriod")[1],
                university: CommitteeForm.getFieldValue("university"),
                college: CommitteeForm.getFieldValue("college"),
                department: CommitteeForm.getFieldValue("department"),
                headOfCommitte: CommitteeForm.getFieldValue("headOfCommittee"),
                reporter: CommitteeForm.getFieldValue("reporter"),
              })
            )
              .then(() => {
                setVisible(false);
                CommitteeForm.resetFields();
                actionRef.current.reload();
              })
              .finally(() => {
                setConfirmLoading(false);
              });
          if (Operation === "Update")
            await dispatch(
              updateCommittee({
                _id: CommitteeForm.getFieldValue("_id"),
                subject: CommitteeForm.getFieldValue("subject"),
                beginPeriod: CommitteeForm.getFieldValue("beginEndPeriod")[0],
                endPeriod: CommitteeForm.getFieldValue("beginEndPeriod")[1],
                university: CommitteeForm.getFieldValue("university"),
                college: CommitteeForm.getFieldValue("college"),
                department: CommitteeForm.getFieldValue("department"),
                headOfCommitte: CommitteeForm.getFieldValue("headOfCommittee"),
                reporter: CommitteeForm.getFieldValue("reporter"),
              })
            )
              .then(() => {
                setVisible(false);
                CommitteeForm.resetFields();
                actionRef.current.reload();
              })
              .finally(() => {
                setConfirmLoading(false);
              });
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setVisible(false);
          setOperation("Create");
          setConfirmLoading(false);
          CommitteeForm.resetFields();
        }}
      >
        <Form name="create-committee" form={CommitteeForm}>
          <Form.Item name="_id" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="university">
            <Select
              showSearch
              placeholder="Choose university"
              optionFilterProp="children"
              onChange={(i) => {
                dispatch(colleges({ university: i })).then((res) => {
                  setCollegesData(res.payload.colleges);
                });
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {universitiesData.map((university) => (
                <Select.Option value={university._id}>
                  {university.universityName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="college">
            <Select
              disabled={!CommitteeForm.getFieldValue("university")}
              showSearch
              placeholder="Choose college"
              optionFilterProp="children"
              onChange={(i) => {
                dispatch(departments({ college: i })).then((res) => {
                  setDepartmentsData(res.payload.departments);
                });
                dispatch(users({ college: i })).then((res) => {
                  setUsersData(res.payload.users);
                });
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {collegesData.map((college) => (
                <Select.Option value={college._id}>
                  {college.collegeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="department">
            <Select
              disabled={!CommitteeForm.getFieldValue("college")}
              showSearch
              placeholder="Choose department"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {departmentsData.map((department) => (
                <Select.Option value={department._id}>
                  {department.departmentName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="subject">
            <Input placeholder="subject" />
          </Form.Item>
          <Form.Item name="beginEndPeriod">
            <RangePicker />
          </Form.Item>
          <Form.Item name="headOfCommittee">
            <Select
              disabled={!CommitteeForm.getFieldValue("college")}
              showSearch
              placeholder="Choose head of committee"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {usersData.map((user) => (
                <Select.Option value={user._id}>
                  {user.firstName} {user.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="reporter">
            <Select
              disabled={!CommitteeForm.getFieldValue("college")}
              showSearch
              placeholder="Choose reporter"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {usersData.map((user) => (
                <Select.Option value={user._id}>
                  {user.firstName} {user.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CommitteePage;
