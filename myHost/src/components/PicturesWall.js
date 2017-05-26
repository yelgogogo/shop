
import { Upload, Icon, Modal } from 'antd';

import {HOST } from '../constants'

class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    
    const imgUrl = this.props.imgUrl;
    const cimg = imgUrl.map((i,k)=>{
      let j ={};
      j.url=i;
      j.uid=k;
      j.name=k;
      j.status= 'done';
      return j;
    })

    this.state = {
    previewVisible: false,
    previewImage: '',
    fileList: cimg,
    //[
    // {
    //   uid: -1,
    //   name: 'xxx.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // }
    //],
    };

    // this.setState({ fileList: cimg});
    // this.state.fileList=ConvArr;
  
  }

  

  // state = {

  //   previewVisible: false,
  //   previewImage: '',
  //   fileList: ConvArr,
  // };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });


  }

  handleChange = ({ fileList }) =>{ 
    this.setState({ fileList });
    const {onChange} = this.props;
    this.props.onChange(fileList.map(fl=>fl.response?(HOST+fl.response.path):''));
    
  }

  render() {

    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="//localhost:3300/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
