import React from 'react';

// 위에 코드 생략(파일이름 LinkButton.js로 저장)
class LinkButton extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      liked:false,
    };
  }
  render(){
    return <button type="submit" onClick={()=>{this.setState({liked:true})}}>{this.state.liked === true ? 'Liked' : 'Like'}</button>
    // return e('button' , {onClick:()=>{this.setState({liked:true})}, type:'submit'} ,this.state.liked === true ? 'Liked' : 'Like', );//<button>Like</button>
  }
}
module.export = { LinkButton };
export default LinkButton;