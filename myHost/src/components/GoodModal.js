import React, { Component } from 'react';
import { Modal, Form, Input,Radio,InputNumber } from 'antd';
import PicturesWall from './PicturesWall';
// import styles from './GoodModal.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  showChange = (e) => {
    console.log(this.props);
    console.log(e);
  };

  // function showChange(e){
  //   console.log(e);
  // }

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { id,shopId,shopName,itemId,categoryId,sold,detail,imgUrl,price,cost,stock,unit,name,discount,discountPrice,onSale } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="Edit User"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="Name"
            >
              {
                getFieldDecorator('name', {
                  initialValue: name,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="unit"
            >
              {
                getFieldDecorator('unit', {
                  initialValue: unit,
                })(<Input />)
              }
            </FormItem>
          
            <FormItem
              {...formItemLayout}
              label="itemId"
            >
              {
                getFieldDecorator('itemId', {
                  initialValue: itemId,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="categoryId"
            >
              {
                getFieldDecorator('categoryId', {
                  initialValue: categoryId,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="sold"
            >
              {
                getFieldDecorator('sold', {
                  initialValue: sold,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="detail"
            >
              {
                getFieldDecorator('detail', {
                  initialValue: detail,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="price"
            >
              {
                getFieldDecorator('price', {
                  initialValue: price,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="cost"
            >
              {
                getFieldDecorator('cost', {
                  initialValue: cost,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="stock"
            >
              {
                getFieldDecorator('stock', {
                  initialValue: stock,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="discount"
            >
              {
                getFieldDecorator('discount', {
                  initialValue: discount,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="discountPrice"
            >
              {
                getFieldDecorator('discountPrice', {
                  initialValue: discountPrice,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              label="Images"
            >
              { 
                getFieldDecorator('imgUrl', {
                  initialValue: imgUrl,
                })(<PicturesWall imgUrl={imgUrl}/>)
              }
            </FormItem>
            <FormItem className="collection-create-form_last-form-item">
            {getFieldDecorator('onSale', {
              initialValue: true,
            })(
              <RadioGroup>
                <Radio value={true}>Public</Radio>
                <Radio value={false}>Private</Radio>
              </RadioGroup>
            )}
          </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);