import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starters');
  const [price, setPrice] = useState('');
  const [cartStatus, setCartStatus] = useState('');

  const handleAddMenuItem = () => {
    if (dishName && description && course && price) {
      const newItem = { dishName, description, course, price };
      setMenuItems([...menuItems, newItem]);
      
      setDishName('');
      setDescription('');
      setCourse('Starters');
      setPrice('');
    }
  };

  const handleRemoveMenuItem = (index) => {
    const updatedMenuItems = menuItems.filter((_, i) => i !== index);
    setMenuItems(updatedMenuItems);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chef's Menu</Text>

      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={dishName}
        onChangeText={setDishName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Button title="Add Item To Menu" onPress={handleAddMenuItem} />

      <Text style={styles.cartStatus}>{cartStatus}</Text>

      <View style={styles.menuContainer}>
        <Text style={styles.subtitle}>Menu</Text>
        <Text>Total Items: {menuItems.length}</Text>

        <FlatList
          data={menuItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>{item.dishName} - {item.course}</Text>
              <Text>{item.description}</Text>
              <Text>Price: R{item.price}</Text>
              <Button title="Remove" onPress={() => handleRemoveMenuItem(index)} />
            </View>
          )}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
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
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontWeight: 'bold',
  },
  cartStatus: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: 'green',
  },
});