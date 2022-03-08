import React, { useRef } from "react";
import { Card } from "antd";
import { Row, Col } from "antd";
import { Input, Avatar, Modal } from "antd";
import MainLayout from "../components/layout";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Select } from "antd";
import ProTable from "@ant-design/pro-table";
import { useDispatch } from "react-redux";
import { users } from "../_actions/user_actions";
import { universities } from "../_actions/university_actions";
import {
  departments,
  createDepartment,
  updateDepartment,
} from "../_actions/department_actions";
import { colleges } from "../_actions/college_actions";
function DepartmentsPage() {
  const actionRef = useRef();
  const [DepartmentForm] = Form.useForm();
  const [Operation, setOperation] = React.useState("Create");
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [collegesData, setCollegesData] = React.useState([]);
  const [usersData, setUsersData] = React.useState([]);
  const [userEditLoading, setUserEditLoading] = React.useState(false);

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
      dataIndex: "departmentName",
      copyable: true,
      ellipsis: true,
      formItemProps: {
        placeholder: "Search department",
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "university",
      render: (c, record) => {
        return <p>{c.university?.universityName || "-"}</p>;
      },
      hideInSearch: true,
    },
    {
      title: "college",
      width: 150,
      render: (c, record) => {
        return <p>{c.college?.collegeName || "-"}</p>;
      },
      hideInSearch: true,
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
                  dispatch(users({ college: record.college?._id })).then(
                    (res) => {
                      setUsersData(res.payload.users);
                      DepartmentForm.setFieldsValue({
                        college: record.college?._id,
                        university: record.university?._id,
                        departmentName: record.departmentName,
                        headOfDepartment: record.headOfDepartment?._id,
                        _id: record._id,
                      });
                      setOperation("Update");
                      setUserEditLoading(false);
                      setVisible(true);
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
          Assign HOD
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
                title="Departments"
                description="List of all departments"
              />
            </Card>
          </Col>
          <Col span={24}>
            <ProTable
              columns={columns}
              request={async (params, sort, filter) => {
                const res = await dispatch(departments(params, sort, filter));
                return {
                  data: res.payload.departments,
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
                  Create Department
                </Button>,
              ]}
            />
          </Col>
        </Row>
      </MainLayout>
      <Modal
        title={`${Operation} Department`}
        visible={visible}
        onOk={async () => {
          setConfirmLoading(true);
          if (Operation === "Create")
            await dispatch(
              createDepartment({
                departmentName: DepartmentForm.getFieldValue("departmentName"),
                headOfDepartment:
                  DepartmentForm.getFieldValue("headOfDepartment"),
                university: DepartmentForm.getFieldValue("university"),
                college: DepartmentForm.getFieldValue("college"),
              })
            ).then(() => {
              setVisible(false);
              setConfirmLoading(false);
              DepartmentForm.resetFields();
              actionRef.current.reload();
            });
          if (Operation === "Update")
            await dispatch(
              updateDepartment({
                _id: DepartmentForm.getFieldValue("_id"),
                departmentName: DepartmentForm.getFieldValue("departmentName"),
                headOfDepartment:
                  DepartmentForm.getFieldValue("headOfDepartment"),
                university: DepartmentForm.getFieldValue("university"),
                college: DepartmentForm.getFieldValue("college"),
              })
            ).then(() => {
              setVisible(false);
              setConfirmLoading(false);
              DepartmentForm.resetFields();
              actionRef.current.reload();
            });
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setVisible(false);
          setOperation("Create");
          DepartmentForm.resetFields();
        }}
      >
        <Form name="create-department" form={DepartmentForm}>
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
              disabled={!DepartmentForm.getFieldValue("university")}
              showSearch
              placeholder="Choose college"
              optionFilterProp="children"
              onChange={(i) => {
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
          <Form.Item name="headOfDepartment">
            <Select
              disabled={!DepartmentForm.getFieldValue("college")}
              showSearch
              placeholder="Choose head of department"
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
          <Form.Item name="departmentName">
            <Input placeholder="department name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default DepartmentsPage;
