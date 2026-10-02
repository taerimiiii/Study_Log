# [4장] 스트림 소개 ~ [5장] 스트림 활용 (~5.6)

## 스터디 퀴즈!

5.6절과 이어지는 문제!!

- 참고용
    
    ```java
    // 거래자 리스트와 트랜잭션 리스트 데이터들 선언
    Trader raoul = new Trader("Raoul", "Cambridge");
    Trader mario = new Trader("Mario", "Milan");
    Trader alan = new Trader("Alan", "Cambridge");
    Trader brian = new Trader("Brian", "Cambridge");
    
    List<Transaction> transactions = Arrays.asList(
        new Transaction(brian, 2011, 300),
        new Transaction(raoul, 2012, 1000),
        new Transaction(raoul, 2011, 400),
        new Transaction(mario, 2012, 710),
        new Transaction(mario, 2012, 700),
        new Transaction(alan, 2012, 950)
    );
    
    // Trader와 Transaction 클래스 정의 선언
    public class Trader {
      private String name;
      private String city;
      public Trader(String n, String c) {
        this.name = n;
        this.city = c;
      }
      public String getName() { return name; }
      public String getCity() { return city; }
    }
    
    public class Transaction {
      private Trader trader;
      private int year;
      private int value;
      public Transaction(Trader trader, int year, int value) {
        this.trader = trader;
        this.year = year;
        this.value = value;
      }
      public Trader getTrader() { return trader; }
      public int getYear() { return year; }
      public int getValue() { return value; }
    }
    ```
    

Q1. 모든 트랜잭션의 거래액이 250 이상인지 검색하는 코드 작성하기!!

Q2. 트랜잭션이 250 미만인 거래가 하나도 없는지 검색하는 코드 작성하기!!

Q3. (빈칸넣기)이 메서드들은 0000 연산 기법을 사용한다.