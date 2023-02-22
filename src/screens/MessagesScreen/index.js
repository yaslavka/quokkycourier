import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import HomeHeader from '../../Components/HomeHeader';

function MessagesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <ScrollView
        style={{width: '100%', height: '100%'}}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={true}>
        <View style={styles.view}>
          <Text style={styles.textcolor}>MessagesScreen</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textcolor: {
    color: 'rgb(159,198,79)',
  },
});
export default MessagesScreen;
