import {View, Text, FlatList, StyleSheet, Button, TextInput, KeyboardAvoidingView, Platform} from "react-native";
import {useRef, useState} from "react";
import {Stack} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";

type TodoItem = {
    title: string;
    done: boolean;
    createdAt: Date;
}

type TodoProps = TodoItem & {
    onDone: () => void;
}

function Todo(props: TodoProps) {
    return (
        <View style={TodoStyles.container}>
            <Text
                style={[
                    TodoStyles.text,
                    props.done && TodoStyles.done
                ]}
            >
                {props.title}
            </Text>
            <Button title="Done" onPress={props.onDone} disabled={props.done} />
        </View>
    )
}

const TodoStyles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#aaa',
    },
    text: {
        fontSize: 20,
    },
    done: {
        textDecorationLine: 'line-through',
    }
})

export default function HomeScreen() {
    const [todos, setTodos] = useState<TodoItem[]>([
        {title: 'Learn React', done: false, createdAt: new Date("2025-08-25T11:18:43.863Z" )},
    ]);

    function onDone(index: number) {
        setTodos(prevTodos => {
            const newTodos = [...prevTodos];
            newTodos[index].done = true;
            return newTodos;
        })
    }

    const todoInputRef = useRef<TextInput>(null);

    function addTodo({ nativeEvent: { text } }: { nativeEvent: { text: string } }) {
        setTodos([
            ...todos,
            {title: text, done: false, createdAt: new Date()}
        ])
        todoInputRef.current?.clear();
    }

    const insets = useSafeAreaInsets();

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View style={{
                flex: 1,
            }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{
                        flex: 1,
                        paddingTop: insets.top,
                    }}
                >
                    <FlatList
                        data={todos}
                        renderItem={({item, index}) => (
                            <Todo
                                title={item.title}
                                done={item.done}
                                createdAt={item.createdAt}
                                onDone={() => onDone(index)}
                            />
                        )}
                        style={{flex: 1}}
                    />
                    <View style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        backgroundColor: '#fff',
                        borderTopWidth: StyleSheet.hairlineWidth,
                        borderTopColor: '#aaa',
                    }}>
                        <TextInput
                            style={{
                                backgroundColor: '#eee',
                                paddingHorizontal: 8,
                                paddingVertical: 5,
                                borderRadius: 5,
                            }}
                            ref={todoInputRef}
                            placeholder="Add a todo..."
                            returnKeyType="done"
                            onSubmitEditing={addTodo}
                        >

                        </TextInput>
                    </View>
                </KeyboardAvoidingView>
                <View style={{
                    height: insets.bottom - 10,
                    backgroundColor: '#fff',
                }} />
            </View>
        </>
    )
}