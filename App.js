import {NavigationContainer} from '@react-navigation/native'
import StackNavigator from './Navigator/StackNavigator'


export default function App() {
    return (
        <NavigationContainer>
            <StackNavigator/>
        </NavigationContainer>
    )
}