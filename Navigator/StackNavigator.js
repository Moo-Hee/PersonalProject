import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screen/HomeScreen'
import LikeScreen from '../Screen/LikeScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator 
            initialRouteName = 'HomeScreen'
            screenOptions = {{headerShown : false}}>

            <Stack.Screen name = 'HomeScreen' component = {HomeScreen}/>
            <Stack.Screen name = 'LikeScreen' component = {LikeScreen}/>

            </Stack.Navigator>
    )
}

export default StackNavigator