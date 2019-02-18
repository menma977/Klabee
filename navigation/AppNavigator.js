import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Login: LoginScreen,
  Main: DrawerNavigator,
}));