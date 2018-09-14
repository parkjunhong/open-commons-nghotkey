# open-commons-nghotkey
Angular JS 'HotKey' Directives Project.

- since: 2018-09-14
- version: 0.1.0
- author: fafanmama@naver.com

## Overview
<i>NgHotkey</i> directive를 이용해서 특정 키보드 키와 함수를 연결할 수 있다.

## Attributes
[필수]
- ng-hotkey: 해당 엘리먼트에서 ng-hotkey 를 사용한다는 선언. (선언적 사용)
- ng-hk-def: 단축키와 함수를 등록 (설정인자 필요)

[선택적]
- ng-hk-args: 함수에서 받을 파라미터 설정 (설정인자 필요)
- ng-hk-prevent: Event.preventDefault 설정 (선언적 사용)
- ng-hk-stop: Event.stopPropagatoin 설정 (선언적 사용)

## 예시

    <ANY
      ng-hotkey
      ng-hk-def = "단축키 설정 객체"
      ng-hk-args = "함수에서 사용할 파라미터 설정"
      ng-hk-prevent
      ng-hk-stop
    >

## 함수의 범위
<i>NgHotkey</i> directive에는 AngularJS의 $scope에 등록된 함수(이하 scope 함수)와 global 함수 모두 사용할 수 있다.
- scope 함수: '함수이름' 사용   

      <ANY    
        ng-hotkey
        ng-hk-def = "new NgHotkey('X', 'delete')"
        ...
      >

- global 함수: $global$.'함수이름' 사용

      <ANY    
        ng-hotkey
        ng-hk-def = "new NgHotkey('X', '$global$.delete')"
        ...
      >

## 다중 단축키 설정
<i>NgHotkey</i> directive는 하나의 HTML Element에 2개 이상의 단축키를 설정하여 같거나 서로 다른 함수와 연결할 수 있다.

- ng-hk-def-{xxx}: {xxx}에 다른 단축키 연결고 구분되는 값을 설정 

      <ANY
        ng-hotkey
        ng-hk-def-rename = "new NgHotkey('R', 'rename')"
        ng-hk-def-delete = "new NgHotkey('X', 'delete')"
        ...
      >
  
## License
[MIT2.0](https://opensource.org/licenses/MIT)
