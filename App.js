import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const credentials = {
  username: 'Regina',
  password: 'Mothiba',
};

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === credentials.username && password === credentials.password) {
      navigation.navigate('ChefScreen');
    } else {
      navigation.navigate('MenuScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

function ChefScreen() {
  const [menuItem, setMenuItem] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuList, setMenuList] = useState([]);

  const handleAddItem = () => {
    if (menuItem && menuDescription && menuPrice) {
      const newItem = {
        id: Math.random().toString(),
        name: menuItem,
        description: menuDescription,
        price: parseFloat(menuPrice),
      };
      setMenuList([...menuList, newItem]);
      Alert.alert('Success', `${menuItem} added to the menu!`);
      setMenuItem('');
      setMenuDescription('');
      setMenuPrice('');
    } else {
      Alert.alert('Input Error', 'Please fill in all fields');
    }
  };

  const handleRemoveItem = (id) => {
    setMenuList(menuList.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chef Menu Management</Text>
      <Text>Total Items Added: {menuList.length}</Text>
      <Text>Add a Menu Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={menuItem}
        onChangeText={setMenuItem}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={menuDescription}
        onChangeText={setMenuDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={menuPrice}
        onChangeText={setMenuPrice}
      />
      <Button title="Add to Menu" onPress={handleAddItem} />

      <FlatList
        data={menuList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Price: R{item.price}</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

function MenuScreen({ navigation }) {
  const menuCategories = {
    Main: [
      { dishName: 'Burger', description: 'Juicy beef burger', price: 50 },
      { dishName: 'Pizza', description: 'Cheese and tomato pizza', price: 75 },
      { dishName: 'Pasta', description: 'Pasta with white sauce', price: 60 },
    ],
    Desserts: [
      { dishName: 'Ice Cream', description: 'Vanilla ice cream', price: 30 },
      { dishName: 'Cake', description: 'Chocolate cake', price: 45 },
    ],
    Drinks: [
      { dishName: 'Coke', description: 'Cold drink', price: 15 },
      { dishName: 'Orange Juice', description: 'Fresh orange juice', price: 20 },
      { dishName: 'Coffee', description: 'Hot coffee', price: 25 },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState('Main');
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    if (cart.find((cartItem) => cartItem.dishName === item.dishName)) {
      Alert.alert('Cart Alert', 'You can only order one item from each category.');
    } else {
      setCart([...cart, item]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu - {selectedCategory}</Text>

      <View style={styles.categoryButtons}>
        {Object.keys(menuCategories).map((category) => (
          <Button key={category} title={category} onPress={() => setSelectedCategory(category)} />
        ))}
      </View>

      <FlatList
        data={menuCategories[selectedCategory]}
        keyExtractor={(item) => item.dishName}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item.dishName}</Text>
            <Text>{item.description}</Text>
            <Text>Price: R{item.price}</Text>
            <Button title="Add to Cart" onPress={() => addToCart(item)} />
          </View>
        )}
      />

      <Button title="Go to Cart" onPress={() => navigation.navigate('CartScreen', { cart })} />
    </View>
  );
}

function CartScreen({ route, navigation }) {
  const { cart } = route.params;

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const averageBalance = cart.length > 0 ? (total / cart.length).toFixed(2) : 0;

  const handlePayNow = () => {
    Alert.alert('Order Confirmed', 'Your order has been confirmed!', [
      { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      {cart.length === 0 ? (
        <Text>No items in cart.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.dishName}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>{item.dishName}</Text>
              <Text>{item.description}</Text>
              <Text>Price: R{item.price}</Text>
            </View>
          )}
        />
      )}
      <Text style={styles.averageText}>Average Balance Due: R{averageBalance}</Text>
      <Button title="Pay Now" onPress={handlePayNow} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="ChefScreen" component={ChefScreen} options={{ title: 'Chef Menu' }} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ title: 'Menu' }} />
        <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'Cart' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  menuItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontWeight: 'bold',
  },
  removeButton: {
    color: 'red',
    fontWeight: 'bold',
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  averageText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});