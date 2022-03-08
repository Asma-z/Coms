import React, { useRef } from "react";
import { Card } from "antd";
import { Row, Col } from "antd";
import { Input, Avatar, Modal } from "antd";
import MainLayout from "../components/layout";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Select } from "antd";
import ProTable from "@ant-design/pro-table";
import { useDispatch } from "react-redux";
import {
  colleges,
  createCollege,
  updateCollege,
} from "../_actions/college_actions";
import { universities } from "../_actions/university_actions";
import { deans } from "../_actions/user_actions";

function CollegePage() {
  const actionRef = useRef();
  const [CollegeForm] = Form.useForm();
  const [DeanForm] = Form.useForm();
  const [Operation, setOperation] = React.useState("Create");
  const [visible, setVisible] = React.useState(false);
  const [assignDeanVisible, setAssignDeanVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const showModal = () => {
    setOperation("Create");
    setVisible(true);
  };
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });
  const dispatch = useDispatch();
  const [state, setState] = React.useState("x");

  const [universitiesData, setUniversities] = React.useState([]);
  const [deansData, setDeans] = React.useState([]);

  React.useEffect(() => {
    dispatch(universities()).then((res) => {
      setUniversities(res.payload.universities);
    });

    return () => {};
  }, [pagination, dispatch]);

  const columns = [
    {
      title: "Name",
      dataIndex: "collegeName",
      copyable: true,
      ellipsis: true,
      formItemProps: {
        placeholder: "Search College",
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "Building",
      dataIndex: "collegeBuilding",
      search: false,
    },
    {
      title: "Link",
      key: "collegeLink",
      dataIndex: "collegeLink",
      hideInSearch: true,
      render: (text, record, _, action) => <a href={text}>College Link</a>,
    },
    {
      title: "Action",
      valueType: "option",
      render: (text, record, _, action) => [
        <Button
          type="link"
          key="editable"
          onClick={() => {
            CollegeForm.setFieldsValue({
              collegeId: record._id,
              name: record.collegeName,
              building: record.collegeBuilding,
              link: record.collegeLink,
              university: record.university,
            });
            setOperation("Update");
            setVisible(true);
          }}
        >
          Edit
        </Button>,
        <Button
          type="link"
          color="primary"
          key="editable"
          onClick={() => {
            dispatch(deans()).then((res) => {
              setAssignDeanVisible(true);
              setDeans(res.payload.deans || []);
              DeanForm.setFieldsValue({
                collegeId: record._id,
              });
            });
          }}
        >
          Assign Dean
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
                title="Colleges"
                description="List of all colleges"
              />
            </Card>
          </Col>
          <Col span={24}>
            <ProTable
              columns={columns}
              request={async (params, sort, filter) => {
                const res = await dispatch(colleges(params, sort, filter));
                return {
                  data: res.payload.colleges,
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
                  onClick={showModal}
                  key="button"
                  icon={<PlusOutlined />}
                  type="primary"
                >
                  Create College
                </Button>,
              ]}
            />
          </Col>
        </Row>
      </MainLayout>
      <Modal
        title={`${Operation} College`}
        visible={visible}
        onOk={async () => {
          setConfirmLoading(true);
          if (Operation === "Create")
            await dispatch(
              createCollege({
                collegeName: CollegeForm.getFieldValue("name"),
                collegeBuilding: CollegeForm.getFieldValue("building"),
                collegeLink: CollegeForm.getFieldValue("link"),
                university: CollegeForm.getFieldValue("university"),
              })
            ).then(() => {
              setVisible(false);
              setConfirmLoading(false);
              CollegeForm.resetFields();
              actionRef.current.reload();
            });
          else
            await dispatch(
              updateCollege({
                id: CollegeForm.getFieldValue("collegeId"),
                collegeName: CollegeForm.getFieldValue("name"),
                collegeBuilding: CollegeForm.getFieldValue("building"),
                collegeLink: CollegeForm.getFieldValue("link"),
                university: CollegeForm.getFieldValue("university"),
              })
            ).then(() => {
              setVisible(false);
              setConfirmLoading(false);
              actionRef.current.reload();
              CollegeForm.resetFields();
            });
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setVisible(false);
          setOperation("Create");
          CollegeForm.resetFields();
        }}
      >
        <Form name="create-college" form={CollegeForm}>
          <Form.Item name="collegeId">
            <Input
              type={"hidden"}
              disabled
              style={{ width: "100%", marginBottom: "2%" }}
              placeholder="College ID"
            />
          </Form.Item>
          <Form.Item name="university">
            <Select
              showSearch
              placeholder="Choose university"
              optionFilterProp="children"
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

          <Form.Item name="name">
            <Input
              style={{ width: "100%", marginBottom: "2%" }}
              placeholder="College Name"
            />
          </Form.Item>
          <Form.Item name="building">
            <Input
              style={{ width: "100%", marginBottom: "2%" }}
              placeholder="College Building"
            />
          </Form.Item>
          <Form.Item name="link">
            <Input
              style={{ width: "100%", marginBottom: "2%" }}
              placeholder="College Link"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Assign Dean"
        visible={assignDeanVisible}
        onOk={() => {
          setConfirmLoading(true);
          dispatch(
            updateCollege({
              id: DeanForm.getFieldValue("collegeId"),
              dean: DeanForm.getFieldValue("dean"),
            })
          )
            .then(() => {
              actionRef.current.reload();
              setAssignDeanVisible(false);
              DeanForm.resetFields();
            })
            .finally(() => {
              setAssignDeanVisible(false);
              setConfirmLoading(false);
            });
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setAssignDeanVisible(false);
          DeanForm.resetFields();
        }}
      >
        <Form name="set-dean" form={DeanForm}>
          <Form.Item name="dean">
            <Select
              showSearch
              placeholder="Choose Dean"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {deansData.map((dean) => (
                <Select.Option value={dean._id}>{dean.firstName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="collegeId">
            <Input
              disabled
              style={{ width: "100%", marginBottom: "2%" }}
              placeholder="College Id"
              value={DeanForm.getFieldValue("collegeId")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CollegePage;
