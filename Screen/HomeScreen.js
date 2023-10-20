import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Dimensions, TouchableOpacity, Image } from 'react-native';
import firebase from '../firebaseconfig';
import { getDocs, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = SCREEN_WIDTH;
const CARD_HEIGHT = SCREEN_HEIGHT;
const CARD_MARGIN = 10;

const HomeScreen = ({route}) => {
  const [data, setData] = useState([]); //DB에서 불러온 정보 저장
  const [currentIndex, setCurrentIndex] = useState(0); //현재 카드 정보
  const [likeText, setLikeText] = useState(''); //왼쪽으로 스와이프 시 화면에 표시
  const [dislikeText, setDislikeText] = useState(''); //오른쪽으로 스와이프 시 화면에 표시
  const [likeList, setLikeList] = useState([]); //사용자가 LIKE 표시한 정보들 저장
  const [likeIndex, setLikeIndex] = useState(0); //사용자가 LIKE 표시한 카드 순서 저장
  const navigation = useNavigation(); //네비게이션

  //DB에 있는 정보 불러오기
  useEffect(() => {
    const readFromDB = async () => {
      try {
        const dataFromDB = await getDocs(collection(firebase, 'music'));
        let tempArray = [];
        dataFromDB.forEach((doc) => {
          tempArray.push({ ...doc.data(), id: doc.music });
        });
        setData(tempArray);
      } catch (error) {
        console.log("Error fetching data:", error.message);
      }
    };
    

    readFromDB();
  }, []);


  useEffect(() => {
    if (currentIndex === data.length-1) {
      // 데이터가 하나도 없을 때 스와이프 중단
      setLikeText('');
      setDislikeText('');
      position.setValue({ x: 0, y: 0 });
      //setCurrentIndex(0); // currentIndex 초기화
    }

  }, [data]);

  const position = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      //스와이프하는 방향 설정
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          forceSwipe('right');
        } else if (gesture.dx < -120) {
          forceSwipe('left');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    let newLikeText = '';
    let newDislikeText = '';

    //스와이프 방향에 따라 텍스트 변경
    if (direction === 'right') {
      newDislikeText = 'DISLIKE';
    } else if (direction === 'left') {
      newLikeText = 'LIKE';
    }

    setLikeText(newLikeText);
    setDislikeText(newDislikeText);

    //스와이프 종료시 리셋 & 종료되고 실행되는 로직
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  //LIKE한 곡의 정보를 저장하는 useEffect
  useEffect(() => {
    console.log("likeindex", currentIndex-1);
    const currentCardData = data[currentIndex-1]
    console.log(currentCardData)
    setLikeList((prevLikeList) => [...prevLikeList, currentCardData])
  }, [likeIndex]);
  
  //스와이프 종료시 카드 순서 Index 증가
  const onSwipeComplete = (direction) => {
    position.setValue({ x: 0, y: 0 });
    
    setCurrentIndex((prevIndex) => prevIndex + 1);
    
  };

  //카드 렌더링
  const renderCard = (item) => (
    <View style={styles.card}>
      <Image
        source = {require('../Assets/example.png')}
        style = {styles.imageStyle}/>
      <Text style={styles.cardTitleStyle}>{item.title}</Text>
      <Text style={styles.cardArtistStyle}>{item.artist}</Text>
      <Text style={styles.cardRuntimeStyle}>{item.runtime}</Text>
      <Text style={styles.cardSubStyle}>{item.albumname} / {item.genre}</Text>
    </View>
  );

  const memoizedCards = useMemo(() => {
    return data.map((item, index) => {
      if (index < currentIndex) {
        // 이미 스와이프한 카드라면 null 반환
        return null;
      }
  
      const isCurrentCard = index === currentIndex;
      const cardPosition = position.getLayout();
      const zIndex = isCurrentCard ? 1 : 0;
  
      const cardStyle = {
        ...cardPosition,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        margin: CARD_MARGIN,
        position: 'absolute',
        zIndex,
      };
  
      return (
        <Animated.View
          key={`card_${item.id}_${index}`} // key를 변경하여 각 카드에 고유한 키 값을 부여
          style={cardStyle}
          {...(isCurrentCard ? panResponder.panHandlers : null)}
        >
          {renderCard(item)}
        </Animated.View>
      );      
    });
  }, [data, currentIndex, position, panResponder]);
  

  //스와이프하는 방향에 따라 배경색 변경
  const backgroundColor = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['green', 'white', 'red'],
  });

  //스와이프가 종료되고 화면을 터치하면 LIKELIST 페이지로 이동
  const navigatetoLikeScreen = () => {
    navigation.navigate('LikeScreen', { likeList });
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      {memoizedCards}
      <Text style={styles.likeText}>{likeText}</Text>
      <Text style={styles.likeText}>{dislikeText}</Text>
      <TouchableOpacity title = "navigaion" onPress = {navigatetoLikeScreen} style = {styles.touchStyle}>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  likeText: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'white',
  },

  imageStyle : {
    width : SCREEN_WIDTH * 0.9,
    height : SCREEN_WIDTH * 0.9,
    position : 'absolute',
    bottom : 300,
    borderRadius : 20,
  },  
  cardTitleStyle: {
    position : 'absolute',
    bottom : 240,
    left : SCREEN_WIDTH * 0.05,
    fontSize: 50,
    fontWeight: 'bold',
  },
  cardArtistStyle : {
    position : 'absolute',
    left : SCREEN_WIDTH * 0.05,
    bottom : 220,
    fontSize : 20,
    fontWeight : 'regular',
    color : 'gray',
  },
  cardRuntimeStyle : {
    position : 'absolute',
    right : SCREEN_WIDTH * 0.05,
    bottom : 185,
    fontSize : 20,
    fontWeight : 'regular',
    color : 'gray',
  },

  cardSubStyle : {
    position : 'absolute',
    bottom : 100,
    fontSize : 15,
    fontWeight : 'bold',
  },

  touchStyle : {
    position : 'absolute',
    backgroundColor : '#00ff0000',
    width : '100%',
    height : '100%'
  }
});

export default HomeScreen;