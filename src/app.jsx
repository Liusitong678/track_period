import { Component } from 'react'
import { Provider } from 'mobx-react'

import counterStore from './store/counter'
import 'taro-ui/dist/style/index.scss'

import './app.scss'

const store = {
  counterStore
}

wx.cloud.init({
  env: 'cloud1-6gjvahf87e0983cd', // ⚠️ 替换为你的云开发环境 ID
  traceUser: true
})

class App extends Component {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  // this.props.children 就是要渲染的页面
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
