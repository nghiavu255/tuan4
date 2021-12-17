import React, { useState, useCallback } from "react";
import {
  Button,
  ButtonGroup,
  Page,
  FormLayout,
  Modal,
  Badge,
  TextField,
  Stack,
  Card,
  ResourceItem,
  ResourceList,
  TextStyle,
  SkeletonPage,
  Layout,
  TextContainer,
  SkeletonDisplayText,
  SkeletonBodyText,
  InlineError,
} from "@shopify/polaris";
import "./Todo.css";
import axios from "axios";
import useGetApi from "../../hooks/useGetApi";
import { URL_API } from "../../constant";
import faker from "faker";
import { AlertMessage } from "../Alert/AlertMessage";

export default function Todo() {
  faker.locale = "vi";
  const [disable, setDisabled] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [status, setStatus] = useState(false);
  const [active, setActive] = useState(false);
  const [alertMess, setAlertMess] = useState(null);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const {
    data: products,
    loading,
    handleSetLoading,
  } = useGetApi({ url: URL_API, status: status });
  const [upProduct, setUpProduct] = useState({
    name: "",
  });
  const { name } = upProduct;
  const resourceName = {
    singular: "todo",
    plural: "todos",
  };
  //status is arrayDependencies-> useEffect-> useGetApi()
  const handleSetStatus = () => {
    setStatus((prev) => !prev);
  };
  //set selectedItems initialization
  const handleSelect = () => {
    setSelectedItems(() => []);
  };
  const handleSetMess = (mess) => {
    setAlertMess(() => mess);
    setTimeout(() => setAlertMess(() => null), 1000);
  };
  // post products
  const handlePostProduct = async (event, upProduct) => {
    if (upProduct.name) {
      try {
        handleChange();
        handleSetLoading(true);
        event.preventDefault();
        const response = await axios.post(URL_API, upProduct);
        if (response.data.success) {
          handleSetMess({
            type: "success",
            message: `Đã thêm sản phẩm ${upProduct.name}`,
          });
        }
        return;
      } catch (error) {
        return error.response.data
          ? handleSetMess({
              type: "dange",
              message: "Xin vui lòng nhập đầy đủ",
            })
          : handleSetMess({
              type: "dange",
              message: "Xin vui lòng thử lại",
            });
      } finally {
        handleSetStatus();
      }
    }
    return;
  };
  // complete array selected
  const handleArrayComplete = async (selectedItems, handleSelect) => {
    const newUpdate = selectedItems.map(() => ({ isCompleted: true }));
    try {
      handleSetLoading(true);
      const response = await axios.put(`${URL_API}/`, [
        newUpdate,
        selectedItems,
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      handleSetStatus();
      handleSelect();
    }
  };
  // compelete a todo
  const completeTodo = async (id, item) => {
    try {
      const newUpdate = [id].map(() => ({ isCompleted: true }));
      handleSetLoading(true);
      const response = await axios.put(`${URL_API}`, [newUpdate, [id]]);
    } catch (error) {
      console.log(error);
    } finally {
      handleSetStatus();
    }
  };
  // delete array selected
  const handleArrayDelete = async (selectedItems, handleSelect) => {
    try {
      handleSetLoading(true);
      const response = await axios.delete(`${URL_API}/`, {
        data: selectedItems,
      });
      if (response.data.success) {
        handleSetMess({
          type: "success",
          message: `Đã xóa ${selectedItems.length} sản phẩm`,
        });
      }
    } catch (error) {
      return error.response.data
        ? handleSetMess({
            type: "dange",
            message: "Có lỗi xảy ra",
          })
        : handleSetMess({
            type: "dange",
            message: "Xin vui lòng thử lại",
          });
    } finally {
      handleSetStatus();
      handleSelect();
    }
  };
  // delete a todo
  const deleteTodo = async (id) => {
    try {
      handleSetLoading(true);
      const response = await axios.delete(`${URL_API}`, {
        data: [id],
      });
      if (response.data.success) {
        console.log(response.data);
        handleSetMess({
          type: "success",
          message: `Đã xóa sản phẩm ${id}`,
        });
      }
    } catch (error) {
      return error.response.data
        ? handleSetMess({
            type: "dange",
            message: "Có lỗi xảy ra",
          })
        : handleSetMess({
            type: "dange",
            message: "Xin vui lòng thử lại",
          });
    } finally {
      handleSetStatus();
    }
  };
  // product post
  const onchangeUpdateForm = (value, id) => {
    {
      value ? setDisabled(false) : setDisabled(true);
    }
    setUpProduct((prevProduct) => {
      return {
        ...prevProduct,
        [document.getElementById(id).getAttribute("name")]: value,
      };
    });
  };
  const renderItem = (item, _, index) => {
    const { id, name, isCompleted } = item;
    return (
      <ResourceItem index={index} id={id}>
        <Stack>
          <Stack.Item fill>
            <h3
              style={{
                textDecoration: isCompleted ? "line-through" : "",
              }}
            >
              <TextStyle variation="strong">{name}</TextStyle>
            </h3>
          </Stack.Item>
          <Stack.Item>
            <ButtonGroup>
              {isCompleted ? (
                <Badge status="success">Done</Badge>
              ) : (
                <Badge>Pending</Badge>
              )}
              {isCompleted ? (
                <Button onClick={() => completeTodo(id, item)}>
                  Incomplete
                </Button>
              ) : (
                <Button onClick={() => completeTodo(id, item)}>
                  Completed
                </Button>
              )}
              <Button onClick={() => deleteTodo(id, index)} destructive>
                Delete
              </Button>
            </ButtonGroup>
          </Stack.Item>
        </Stack>
      </ResourceItem>
    );
  };
  const promotedBulkActions = [
    {
      content: "Complete",
      onAction: () => handleArrayComplete(selectedItems, handleSelect),
    },
    {
      content: "Delete",
      onAction: () => handleArrayDelete(selectedItems, handleSelect),
    },
  ];
  const alertError = (
    <InlineError message="Store name is required" fieldID="myFieldID" />
  );
  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
  return (
    <Page
      title={"Todoes"}
      primaryAction={{
        content: "Create todo",
        onAction: handleChange,
      }}
    >
      <Card>
        <AlertMessage info={alertMess} />
        <Modal
          open={active}
          onClose={handleChange}
          title="Create new a todo"
          primaryAction={{
            disabled: disable,
            content: "Create",
            onClick: (event) => handlePostProduct(event, upProduct),
          }}
          secondaryActions={[
            {
              content: "Close",
              onClick: handleChange,
            },
          ]}
        >
          <Modal.Section>
            <FormLayout>
              <TextField
                name="name"
                value={name}
                onChange={onchangeUpdateForm}
                autoComplete="off"
                placeholder="This is my todo name"
              />
            </FormLayout>
          </Modal.Section>
        </Modal>
        <ResourceList
          resourceName={resourceName}
          items={products}
          renderItem={renderItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          promotedBulkActions={promotedBulkActions}
          selectable
          loading={loading ? "loading" : 0}
        />
      </Card>
    </Page>
  );
}
