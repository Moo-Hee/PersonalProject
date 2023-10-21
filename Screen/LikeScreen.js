import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const LikeScreen = ({ route }) => {
  const { likeList } = route.params; //HomeScreen 컴포넌트에서 LIKE리스트를 받아옴
  const [dataLoad, setDataLoad] = useState(false);

  //데이터 로드
  useEffect(() => {
    setDataLoad(true);
    console.log("likeListScreen")
    console.log(likeList)
  }, [likeList]);

  return (
  <View style={styles.mainView}>
    {dataLoad ? (
      likeList && likeList.length > 0 ? (
        // 데이터가 로딩된 후에 렌더링되는 내용
        <View>
          <Text style={styles.headerStyle}>Like List</Text>
          {likeList.map((item) => (
            item ? (
              <View key={item.id} style={styles.subViewStyle}> 
                <Text style={styles.titleStyle}>{item.title}</Text> 
                <Text style={styles.hyphenStyle}> - </Text> 
                <Text style={styles.artistStyle}>{item.artist}</Text> 
              </View>
            ) : null
          ))}
        </View>
      ) : (
        <Text>No items in the like list.</Text>
      )
    ) : (
      // 데이터가 로딩 중일 때 렌더링되는 내용
      <Text>Loading...</Text>
    )}
  </View>
);

};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingTop : 50,
  },

  headerStyle : {
    fontSize : 40,
    fontWeight : 'bold',
    paddingTop : 20,
    paddingBottom : 20,
    marginLeft : 20,
  },

  subViewStyle : {
    borderTopWidth : 2,
    borderColor : 'gray',
    flexDirection : 'row',
    paddingBottom : 10,
    paddingTop : 10,
  },

  titleStyle : {
    fontSize : 20,
    fontWeight : 'bold',
    marginLeft : 20,
    marginRight : 10,
  },

  hyphenStyle : {
    fontSize : 20,
    fontWeight : 'bold',
  },

  artistStyle : {
    fontSize : 20,
    fontWeight : 'bold',
    marginLeft : 10,
    marginRight : 50,
  }
});

export default LikeScreen;
