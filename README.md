# open-commons-nghotkey
[__Angular JS__](https://angularjs.org/) '__Hotkey__' Directive.

* since: 2018-09-14
* version: 0.2.0
* author: fafanmama@naver.com

## 개요
__NgHotkey__ directive를 이용해서 특정 키보드 키와 함수를 연결할 수 있다.

## HTML Attributes
> __필수__
* _ng-hotkey_: 해당 엘리먼트에서 __NgHotkey__ 를 사용한다는 선언. (선언적 사용)
* _ng-hk-def_: 단축키와 함수를 등록 (설정인자 필요)

> __선택적__
* _ng-hk-args_: 함수에서 받을 파라미터 설정 (설정인자 필요)
* _ng-hk-prevent_: [Event.preventDefault](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) 설정 (선언적 사용)
* _ng-hk-stop_: [Event.stopPropagatoin](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) 설정 (선언적 사용)

> __예시__
```
<ANY
    ng-hotkey
    ng-hk-def = "단축키 설정 객체"
    ng-hk-args = "함수에서 사용할 파라미터 설정"
    ng-hk-prevent
    ng-hk-stop
>
```

> __단축키 객체__
 
```
new NgHotkey( 단축키, 함수, 마스킹)
```
* 단축키: 키보드 문자를 사용 (긴 내용은 줄임), [참조문서](https://docs.google.com/spreadsheets/d/1JXrmE_ywFWj-bWNpVoIoyIIf7F0h7wo6lkIwdrrX5lM/edit?usp=sharing)의 __Abbr.__ 사용
* 함수: 함수 이름을 사용
* 마스킹: 아래 3개 중에 하나를 입력하거나 입력하지 않음.
  - _ctrl_: **_Ctrl_** 키 설정
  - _shift_: **_Shift_** 키 설정
  - _all_: **_Ctrl_** + **_Shift_** 키 설정
  - 입력하지 않음: 설정하지 않음.
  
## 함수의 범위
__NgHotkey__ directive에서는 키워드(_global::_)를 이용하여 [__Angular JS__](https://angularjs.org/)의 [_$scope_](https://docs.angularjs.org/api/ng/type/$rootScope.Scope) 에 등록된 함수(이하 scope 함수)와 global 함수 모두 사용할 수 있다.

> scope 함수: '함수이름' 사용   
  ```
  <ANY    
    ng-hotkey
    ng-hk-def = "new NgHotkey('X', 'delete')"
    ...
  >
  ```      

> global 함수: _global::_'함수이름' 사용
  ```
  <ANY    
    ng-hotkey
    ng-hk-def = "new NgHotkey('X', 'global::delete')"
    ...
  >
  ```

## 함수 파라미터의 범위
__NgHotkey__ directive에서는 키워드(_global::_)를 이용하여 [__Angular JS__](https://angularjs.org/)의 [_$scope_](https://docs.angularjs.org/api/ng/type/$rootScope.Scope)에 등록된 변수(이하 scope 변수)와 global 변수 모두 사용할 수 있다. 또한 __2개 이상__ 의 파라미터는 콤마(,)로 구분해서 설정한다.

> scope 변수: '변수이름' 사용   
  ```
  <ANY    
    ng-hotkey
    ng-hk-def = "new NgHotkey('X', 'delete')"
    ng-hk-args = "id"
    ...
  >
  ```

> global 변수: _global::_'변수이름' 사용
  ```
  <ANY    
    ng-hotkey
    ng-hk-def = "new NgHotkey('X', 'global::delete')"
    ng-hk-args = "global::id, location, 'today is friday'"
    ...
  >
  ```

## 다중 단축키 설정
__NgHotkey__ directive는 하나의 HTML Element에 2개 이상의 단축키를 설정하여 같거나 서로 다른 함수와 연결할 수 있다.

> _ng-hk-def-{xxx}_: {xxx}에 다른 단축키 연결고 구분되는 값을 설정 
  ```
  <ANY
    ng-hotkey
    ng-hk-def-rename = "new NgHotkey('R', 'rename')"
    ng-hk-def-delete = "new NgHotkey('X', 'delete')"
    ...
  >
  ```
  
## 기타 지원
__NgHotkey__ directive는 단축키와 연결되어 실행되는 함수(scope 함수, global 함수에 상관없이)에 설정한 파라미터 외에 파라미터 마지막에 [_Angular JS_](https://angularjs.org) 의 [_$scope_](https://docs.angularjs.org/api/ng/type/$rootScope.Scope) 객체와 발생한 [_KeyboardEvent_](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) 객체를 전달한다.

> javascript
```
// global variable
var date = '2018-09-14';
//  global function
var callback = function(str, param, scope, event) {
    console.log("str", str);
    console.log("param", param);
    console.log("scope", scope);
    console.log("event", event);
}
```
> html
```
<ANY
    ng-hotkey
    ng-hk-def = "new NgHotkey('S', 'global::callback')"
    ng-hk-args = "'001-A-T001', global::date"
>
```
실행된 함수의 로그결과에는 _ng-hk-args_ 설정된 2개의 값('001-A-T001'과 global 변수인 '2018-09-14') 외에도 [_$scope_](https://docs.angularjs.org/api/ng/type/$rootScope.Scope) 객체와 _event_ 객체도 전달된다.

## Update

> 2018-09-16
* __Release: 0.2.0__
* global 함수/변수 접근자 변경: _$global$_ -> _global::_
* 함수 파라미터 처리 기능 확장
  - nested 배열 형태의 설정 지원 (내부 Parser 추가)
  - 함수 파라미터 lazy-evaluation 을 통한 성능향상(기대?)
  
## License
[MIT2.0](https://opensource.org/licenses/MIT)
