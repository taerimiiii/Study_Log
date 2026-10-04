# [2장] 동작 파라미터화 코드 전달하기

## 스터디 퀴즈!

```java
package modernjavainaction.chap02.challenge;

class SuperClass {
    public int value = 1;
    
    public void print() {
        System.out.println("SuperClass Print");
    }
}

public class ShadowingChallenge {
    public int value = 2;

    public void execute() {
        int value = 3;

        SuperClass obj = new SuperClass() {
            public int value = 4;

            @Override
            public void print() {
                int value = 5;
                
                // 아래 4개의 출력문은 각각 무엇을 출력?
                System.out.println(value);
                System.out.println(this.value);
                System.out.println(super.value);
                System.out.println(ShadowingChallenge.this.value);
            }
        };
        
        obj.print();
    }

    public static void main(String... args) {
        new ShadowingChallenge().execute(); // ???
    }
}
```

정답:
5
4
1
2

해설:
도서의 익명 클래스 문제를 변형해서 출제해 보았다.

1. `System.out.println(value);` -> **5** 출력

자바에서 특정 변수를 부를 때, 컴파일러는 가장 먼저 현재 실행 중인 가장 좁은 스코프(코드 블록 내부)를 탐색한다. 즉, 가장 가까운 위치에 있는 지역 변수(Local Variable)를 우선적으로 찾는다.

현재 출력문이 실행되는 곳은 익명 클래스 내부의 `print()` 메서드 안쪽이다. 이 메서드 내부에는 `int value = 5;`라는 지역 변수가 선언되어 있다. 따라서 `this`나 `super` 같은 별도의 수식어 없이 `value`만 단독으로 호출하면, 자바는 가장 가까운 지역 변수인 5를 가리키게 되어 5가 출력된다.

2. `System.out.println(this.value);` -> **4** 출력

`this` 키워드는 **현재 자신이 속한 객체의 인스턴스**를 가리키는 지시자이다. 여기서 가장 헷갈리기 쉬운 부분은 '현재 내가 어떤 객체 안에 있는가?' 이다.

코드가 작성된 큰 껍데기는 `ShadowingChallenge` 클래스 내부이지만, 이 출력문이 위치한 정확한 지점은 `new SuperClass() { ... }` 문법을 통해 즉석에서 생성된 **익명 클래스의 내부**이다. 따라서 여기서의 `this`는 `ShadowingChallenge`가 아닌 익명 클래스 객체 자신을 의미한다. 익명 클래스 내부에 인스턴스 멤버 변수로 `public int value = 4;`를 새롭게 정의해 두었으므로, `this.value`는 이 익명 클래스의 멤버 변수인 4를 찾아 출력하게 된다.

3. `System.out.println(super.value);` -> **1** 출력

`super` 키워드는 현재 클래스가 상속받은 부모 클래스의 객체(인스턴스)를 가리킨다.

현재 코드는 `SuperClass`를 상속받아 몸통을 구현하는 익명 클래스 안에 속해 있다. 그러므로 `super`는 곧 부모인 `SuperClass`를 지칭하게 된다. 원본 `SuperClass` 클래스의 정의를 살펴보면 클래스 내부에 `public int value = 1;`이라는 인스턴스 변수가 선언되어 있는 것을 알 수 있다. 자식 클래스에서 `super` 키워드를 통해 부모 클래스의 멤버 변수를 명시적으로 호출했기 때문에 1이 출력된다.

4. `System.out.println(ShadowingChallenge.this.value);` -> **2** 출력

익명 클래스나 내부 클래스(Inner Class) 안에 있을 때, 자신을 감싸고 있는 **바깥쪽 외부 클래스(Enclosing Class)의 인스턴스 멤버에 접근하고 싶을 때** 사용하는 특수한 문법이다. `외부클래스이름.this` 형태로 작성하여 사용한다.

현재 익명 클래스를 밖에서 감싸고 있는 외부 클래스는 `ShadowingChallenge`이다. 따라서 `ShadowingChallenge.this`라고 명시하면 외부 클래스인 `ShadowingChallenge`의 객체 인스턴스를 정확히 가리키게 된다. 해당 클래스의 최상단 멤버 변수로 `public int value = 2;`가 선언되어 있으므로, 최종적으로 2를 찾아 출력하게 된다.

추가 해석:

Q1. `execute()` 메서드의 `int value = 3;`은 왜 출력할 수 없을까?

A1. `execute()` 메서드 내부에 선언된 지역 변수 `value = 3`은, 익명 클래스의 `print()` 메서드 내부에 있는 지역 변수 `value = 5`에 의해 이름이 완전히 가려지는 섀도잉(Shadowing)이 발생하기 때문이다!

Q2. 어째서 `System.out.println("SuperClass Print");` 출력문이 실행되지 않을까?

A2. `ShadowingChallenge` 클래스에서 `print()` 함수를 오버라이딩 했기 때문이다!!