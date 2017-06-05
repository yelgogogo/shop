import dva from 'dva';
import './index.css';
// import { browserHistory } from 'dva/router';
// 1. Initialize
const app = dva({ 
	//  history: browserHistory, 
});

app.model(require("./models/shop"));

app.model(require("./models/trans"));

app.model(require("./models/editgood"));

app.model(require("./models/basket"));

app.model(require("./models/order"));

app.model(require("./models/cart"));

app.model(require("./models/good"));

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
