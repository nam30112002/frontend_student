import { FlatList, Text, View, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { API_URL } from '@env';
import axios from 'axios';
import { getData, storeData, formatToView, convertTime } from './Utility';
import { useNavigation, useFocusEffect } from '@react-navigation/native';


export default function ClassDetail() {
  const Separator = () => <View style={{ height: 10 }} />;
  const navigation = useNavigation();
  const [attendanceList, setAttendanceList] = useState([]);
  const [courseCode, setCourseCode] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const fetchData = async () => {
    setCourseCode(await getData('currentClassCode'));
    setSubject(await getData('currentClassSubject'));
    setDescription(await getData('currentClassDescription'));
    let currentClassId = await getData('currentClassId');
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/student/get-my-attendance-in-a-course?courseId=${currentClassId}`,
      headers: {
        'Authorization': 'Bearer ' + await getData('accessToken')
      }
    };

    axios.request(config)
      .then((response) => {
        setAttendanceList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <>
      <View style={styles.classInfoContainer}>
        <Text style={styles.classInfoText}>Mã lớp: {courseCode}</Text>
        <Text style={styles.classInfoText}>Môn học: {subject}</Text>
        <Text style={styles.classInfoText}>Mô tả: {description}</Text>
      </View>

      <View style={[styles.container]}>
        <Text style={styles.text1}>Danh sách buổi điểm danh của bạn</Text>
      </View>
      <View style={[styles.studentList]}>
        <FlatList
          data={attendanceList}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Thời gian điểm danh:</Text>
                <Text style={styles.infoValue}>{formatToView(convertTime(item.attendanceTime))}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Buổi học số:</Text>
                <Text style={styles.infoValue}>{item.lectureNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Đi/Vắng:</Text>
                <Text style={styles.infoValue}>{item.isAttendance ? 'Đi' : 'Vắng'}</Text>
              </View>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          ItemSeparatorComponent={Separator}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  text1: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    color: '#2C3E50', // Màu văn bản tối để dễ đọc
  },
  studentList: {
    flex: 10,
    width: "100%",
    padding: 15,
    backgroundColor: '#ECF0F1', // Màu nền nhẹ nhàng
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#ECF0F1', // Màu nền sáng và hài hòa
    flexDirection: 'row',
  },
  activeBar: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ECF0F1', // Màu nền đậm hơn một chút để tạo sự khác biệt
    //padding: 5, paddingVertical: 10, paddingHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  addButton: {
    backgroundColor: '#34568B', // Màu xanh tươi sáng cho nút
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  classInfoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    borderColor: '#BDC3C7', // Viền nhẹ nhàng để tách biệt
    borderWidth: 1,
    shadowColor: '#000', // Thêm đổ bóng để nổi bật hơn
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  classInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2C3E50', // Màu văn bản đậm để dễ đọc
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center' // Aligns text and icon vertically
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
  },
});