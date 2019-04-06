const webpack = require('webpack')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    // ? '/production-sub-path/'
    ?'./'
    : '/'
  ,pages:{
  	index:{
  		entry: 'src/main.js'
  	}
  }
  // ,chainWebpack: config=>{
  // 	config
  // 		.plugin('ProvidePlugin')
  // 		.use(webpack.ProvidePlugin,[
  // 			{
  // 				$: 'jquery'
  // 				,jQuery: 'jquery'
  // 			}
  // 		])
  // 	config.externals({
  // 		jquery: 'jQuery'
  // 	})
  // }
//   ,configureWebpack:{
//   	plugins:[
//   		new webpack.ProvidePlugin({
//   			$: 'jquery'
//   			,jquery: 'jquery'
//   			,'window.jQuery': 'jquery'
//   			,jQuery: 'jquery'
//   		})
//   	]
//   }
}