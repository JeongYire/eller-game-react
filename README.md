선형시간 알고리즘으로 유명한 엘러 알고리즘을 이용한 간단한 미로탈출 게임입니다.

엘러알고리즘의 순서는 이렇습니다. 

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FxdDoX%2FbtqH8bZ7fvg%2F2V4m1sIZk1fM6hHATVnHL0%2Fimg.png" />

1. 같은 행에 속한 칸들을 순회해 경로를 넣어서 초기화해줍니다. 경로는 특정한 칸이 서로 연결되어있는지 확인하기 위함입니다. 

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FccahOa%2FbtqIdraeo9i%2FpSi7NcfHJtmsEodcWkQL30%2Fimg.png" />

2. 같은 행에있는 칸들을 순회하여, 인접하면서 같은 경로에 있지 않은 ( 즉, 사이가 벽으로 막혀있는 ) 칸을 
무작위하게 합칠지, 합치지 않을지 정합니다.

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdXJ2fL%2FbtqH9amBWaB%2FydXkieuCwBmPkcI12pQ3JK%2Fimg.png" />

3. 1~2번이 끝난후, 남은 경로들을 조회합니다. 이 경로에 속한 칸들중 최소한 한칸의 구멍을 아래로 뚫어, 같은 경로로 만들어줍니다

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F3rgtD%2FbtqIate3Bs9%2FbT9ko1ZaWlXEVvtqCEo0DK%2Fimg.png"/>

4. 다음행으로 넘어가 1번과 같이 초기화합니다. 3번의 과정으로 인해 뚫린 칸은 초기화하지 않습니다. 마지막행에 도달할때까지 이 과정을 반복합니다 

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fcc3KK3%2FbtqIgkaYFKR%2FRDt1KlmkmNhF3tOukx9MEK%2Fimg.png"/>

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbDtDrv%2FbtqH8cxVXkH%2FqAqiFCIUzMHPxp37PKLpf1%2Fimg.png"/>

5. 마지막행의 경우 인접하면서 같은 경로에 있지 않은 칸들을 연결합니다. 이 작업은 무작위하지 않습니다.  










