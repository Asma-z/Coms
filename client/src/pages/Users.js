import React, { useRef } from "react";
import { Card, notification } from "antd";
import { Row, Col } from "antd";
import { Input, Avatar, Modal } from "antd";
import MainLayout from "../components/layout";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Select } from "antd";
import ProTable from "@ant-design/pro-table";
import { useDispatch } from "react-redux";
import { users, createUser, updateUser } from "../_actions/user_actions";
import { universities } from "../_actions/university_actions";
import { resetPassword } from "../_actions/user_actions";
import { departments } from "../_actions/department_actions";
import { colleges } from "../_actions/college_actions";
function UsersPage() {
  const actionRef = useRef();
  const [UserForm] = Form.useForm();
  const [Operation, setOperation] = React.useState("Create");
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [collegesData, setCollegesData] = React.useState([]);
  const [departmentsData, setDepartmentsData] = React.useState([]);
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
      title: "first Name",
      dataIndex: "firstName",
      width: 150,
      copyable: true,
      ellipsis: true,
      formItemProps: {
        placeholder: "Search User",
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "last Name",
      dataIndex: "lastName",
      width: 150,
      copyable: true,
      ellipsis: true,
      formItemProps: {
        placeholder: "Search User",
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "phone number",
      dataIndex: "phoneNumber",
      width: 150,
      copyable: true,
      ellipsis: true,
      formItemProps: {
        placeholder: "Search User",
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "Role",
      width: 100,
      dataIndex: "role",
      search: false,
    },
    {
      title: "university",
      width: 150,
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
                  dispatch(departments({ college: record.college?._id })).then(
                    (res) => {
                      setDepartmentsData(res.payload.departments);
                      UserForm.setFieldsValue({
                        college: record.college?._id,
                        department: record.department?._id,
                        university: record.university?._id,
                        firstName: record.firstName,
                        lastName: record.lastName,
                        email: record.email,
                        phoneNumber: record.phoneNumber,
                        role: record.role,
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
        <Button
          type="link"
          color="primary"
          key="editable"
          onClick={() => {
            dispatch(resetPassword({ email: record.email }))
              .then((response) => {
                notification.info({
                  message: `Reset password email is sent to ${record.email}`,
                  placement: "topRight",
                  type: "success",
                });
              })
              .catch((err) => {
                notification.info({
                  message: `Failed to reset password`,
                  placement: "topRight",
                  type: "error",
                });
              });
          }}
        >
          reset pass
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
                title="Users"
                description="List of all users"
              />
            </Card>
          </Col>
          <Col span={24}>
            <ProTable
              columns={columns}
              request={async (params, sort, filter) => {
                const res = await dispatch(users(params, sort, filter));
                return {
                  data: res.payload.users,
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
                  Create User
                </Button>,
              ]}
            />
          </Col>
        </Row>
      </MainLayout>
      <Modal
        title={`${Operation} User`}
        visible={visible}
        onOk={async () => {
          setConfirmLoading(true);
          if (Operation === "Create")
            await dispatch(
              createUser({
                firstName: UserForm.getFieldValue("firstName"),
                lastName: UserForm.getFieldValue("lastName"),
                email: UserForm.getFieldValue("email"),
                university: UserForm.getFieldValue("university"),
                college: UserForm.getFieldValue("college"),
                department: UserForm.getFieldValue("department"),
                phoneNumber: UserForm.getFieldValue("phoneNumber"),
                role: UserForm.getFieldValue("role"),
              })
            ).then(() => {
              setVisible(false);
              setConfirmLoading(false);
              UserForm.resetFields();
              actionRef.current.reload();
            });
          if (Operation === "Update") {
            await dispatch(
              updateUser({
                _id: UserForm.getFieldValue("_id"),
                firstName: UserForm.getFieldValue("firstName"),
                lastName: UserForm.getFieldValue("lastName"),
                email: UserForm.getFieldValue("email"),
                university: UserForm.getFieldValue("university"),
                college: UserForm.getFieldValue("college"),
                department: UserForm.getFieldValue("department"),
                phoneNumber: UserForm.getFieldValue("phoneNumber"),
                role: UserForm.getFieldValue("role"),
              })
            ).then(() => {
              setVisible(false);
              setConfirmLoading(false);
              UserForm.resetFields();
              actionRef.current.reload();
            });
          }
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setVisible(false);
          setOperation("Create");
          UserForm.resetFields();
        }}
      >
        <Form name="create-user" form={UserForm}>
          <Form.Item name="_id">
            <Input type={"hidden"} disabled />
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
                <Select.Option key={university._id} value={university._id}>
                  {university.universityName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="college">
            <Select
              disabled={!UserForm.getFieldValue("university")}
              showSearch
              placeholder="Choose college"
              optionFilterProp="children"
              onChange={(i) => {
                dispatch(departments({ college: i })).then((res) => {
                  setDepartmentsData(res.payload.departments);
                });
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {collegesData.map((college) => (
                <Select.Option key={college._id} value={college._id}>
                  {college.collegeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="department">
            <Select
              disabled={!UserForm.getFieldValue("college")}
              showSearch
              placeholder="Choose department"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {departmentsData.map((department) => (
                <Select.Option ey={department._id} value={department._id}>
                  {department.departmentName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="role">
            <Select placeholder="Choose role" optionFilterProp="children">
              <Select.Option key={"admin"}>admin</Select.Option>
              <Select.Option key={"dean"}>dean</Select.Option>
              <Select.Option key={"head-of-department"}>
                head of department
              </Select.Option>
              <Select.Option key={"member"}>member</Select.Option>
              <Select.Option key={"reporter"}>reporter</Select.Option>
              <Select.Option key={"head-of-committee"}>
                head of committee
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="firstName">
            <Input placeholder="user first name" />
          </Form.Item>
          <Form.Item name="lastName">
            <Input placeholder="user last name" />
          </Form.Item>
          <Form.Item name="email">
            <Input type={"email"} placeholder="user email" />
          </Form.Item>
          <Form.Item name="phoneNumber">
            <Input placeholder="Phone Number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UsersPage;
