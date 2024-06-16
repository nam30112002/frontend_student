import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import  CheckBox  from '@react-native-community/checkbox';
import axios from 'axios';
import { API_URL } from '@env';
import { getData } from './Utility';

export default function AttendanceForm() {
  const [code, setCode] = useState('');
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});

  const handleSubmitCode = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/student/get-form-by-code?code=${code}`,
      headers: { 
        'Authorization': 'Bearer ' + await getData('accessToken')
      }
    };
    
    axios.request(config)
      .then((response) => {
        setFormData(response.data);
        const falseAnswers = response.data.questions.flatMap(question =>
          question.answers
            .map(answer => ({ id: answer.id, isTrue: false }))
        );
        console.log(falseAnswers);
        setAnswers(falseAnswers);
      })
      .catch((error) => {
        Alert.alert("Error", error.response.data.message || "Có lỗi xảy ra!");
      });
  };

  const handleSubmitAnswers = async () => {
    const submitData = {
      code: formData.code,
      answers: answers.map((answer) => ({
        id: answer.id,
        isTrue: answer.isTrue
      }))
    };
    console.log(submitData);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_URL}/student/submit-answers`,
      headers: {
        'Authorization': 'Bearer ' + await getData('accessToken'),
        'Content-Type': 'application/json'
      },
      data: submitData
    };

    // axios.request(config)
    //   .then((response) => {
    //     Alert.alert("Success", "Câu trả lời đã được gửi!");
    //   })
    //   .catch((error) => {
    //     Alert.alert("Error", error.response.data.message || "Có lỗi xảy ra!");
    //   });
  };

  const handleAnswerChange = (questionIndex, answerId) => {
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].id === answerId) {
        answers[i].isTrue = !answers[i].isTrue;
        setAnswers([...answers]);
        return;
      }
    }
  };

  const backToFillCode = () => {
    setFormData(null);
    setAnswers({});
  };

  const checkIsTrueFromId = (answerId) => {
    // Kiểm tra xem có dữ liệu trong `answers` không
    if (answers && answers.length > 0) {
      // Lặp qua từng câu trả lời trong mảng `answers`
      for (const answer of answers) {
        // Nếu id của câu trả lời trùng với answerId và isTrue là true, trả về true
        if (answer.id === answerId && answer.isTrue) {
          return true;
        }
      }
    }
    // Nếu không tìm thấy câu trả lời tương ứng hoặc isTrue không phải là true, trả về false
    return false;
  }
  
  return (
    <View style={styles.container}>
      {!formData ? (
        <>
          <Text style={styles.title}>Nhập mã của bạn</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mã"
              value={code}
              onChangeText={setCode}
            />
            <Button title="Gửi" onPress={handleSubmitCode} />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.attendanceTitle}>Điểm danh</Text>
          <FlatList
            data={formData.questions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.questionContainer}>
                <Text style={styles.question}>Câu hỏi {index + 1}: {item.content}</Text>
                {item.answers.map((answer, answerIndex) => (
                  <View key={answer.id} style={styles.answerContainer}>
                    <Text style={styles.answerText}>{answer.content}</Text>
                    <CheckBox
                      value={checkIsTrueFromId(answer.id)}
                      onValueChange={() => handleAnswerChange(index, answer.id)}
                      style={styles.checkbox}
                    />
                  </View>
                ))}
              </View>
            )}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmitAnswers}>
              <Text style={styles.buttonText}>Gửi câu trả lời</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={backToFillCode}>
              <Text style={styles.buttonText}>Quay lại điền code khác</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
  },
  attendanceTitle: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionContainer: {
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    elevation: 2,
  },
  question: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#555',
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  answerText: {
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    marginLeft: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
