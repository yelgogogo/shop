import React, { Component } from 'react';
import { Modal, Form, Input,Radio,InputNumber } from 'antd';
import PicturesWall from './PicturesWall';
import {doDiscount} from '../constants'
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
    const x=doDiscount(this.props.form.getFieldValue('price'),this.props.form.getFieldValue('discount'));
    this.props.form.setFieldsValue({discountPrice:x});
    this.props.form.validateFields((err, values) => {
      
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  // priceDiscount = (p,d) => {
  //    console.log(this.props);
  //    console.log(this.state);
  //     //this.props.form.setFieldsValue({discountPrice:doDiscount(p,d)}) 
  //     console.log(doDiscount(p,d));
  //   };

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
          title="商品编辑"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            {getFieldDecorator('categoryId', {initialValue: categoryId,})(<div />)}
            {getFieldDecorator('shopId', {initialValue: shopId,})(<div />)}
            {getFieldDecorator('shopName', {initialValue: shopName,})(<div />)}
            {getFieldDecorator('id', {initialValue: id,})(<div />)}        
            {getFieldDecorator('discountPrice', {initialValue: discountPrice,})(<div />)}  
            <FormItem
              {...formItemLayout}
              label="商品名称"
            >
              {
                getFieldDecorator('name', {
                  initialValue: name,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="单位"
            >
              {
                getFieldDecorator('unit', {
                  initialValue: unit,
                })(<Input />)
              }
            </FormItem>
          
            <FormItem
              {...formItemLayout}
              label="所属分类"
            >
              {
                getFieldDecorator('itemId', {
                  initialValue: itemId,
                })(<InputNumber disabled={true}/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="已售出"
            >
              {
                getFieldDecorator('sold', {
                  initialValue: sold,
                })(<InputNumber disabled={true}/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="详情"
            >
              {
                getFieldDecorator('detail', {
                  initialValue: detail,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="价格"
            >
              {
                getFieldDecorator('price', {
                  initialValue: price,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="成本"
            >
              {
                getFieldDecorator('cost', {
                  initialValue: cost,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="库存"
            >
              {
                getFieldDecorator('stock', {
                  initialValue: stock,
                })(<InputNumber />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="折扣"
            >
              {
                getFieldDecorator('discount', {
                  initialValue: discount,
                  // onChange:this.priceDiscount(price,discount),
                })(<InputNumber />)
              }
            </FormItem>
            <div>折扣价格:{doDiscount(this.props.form.getFieldValue('price'),this.props.form.getFieldValue('discount'))}</div>
            <FormItem
              label="图片"
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
                <Radio value={true}>销售中</Radio>
                <Radio value={false}>下架</Radio>
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