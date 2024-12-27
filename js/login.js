// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyA8Do_4_ZDADE64D6v1gbF36_NfaRDvh24",
  authDomain: "ctrls-miniproject.firebaseapp.com",
  projectId: "ctrls-miniproject",
  storageBucket: "ctrls-miniproject.appspot.com",
  messagingSenderId: "496866464655",
  appId: "1:496866464655:web:8d866192211cf7699d31fa",
  measurementId: "G-SGY1JM32JF",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOMContentLoaded 이벤트
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");

  if (!container) {
    console.error("Container not found!");
    return;
  }

  setTimeout(() => {
    container.classList.add("sign-in");
  }, 200);

  // UI 상태 토글 함수
  window.toggle = () => {
    container.classList.toggle("sign-in");
    container.classList.toggle("sign-up");
  };

  // Toast 메시지 함수
  function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = `toast ${isError ? "error" : ""} show`;

    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000); // 3초 후에 사라짐
  }

  const signInBtn = document.getElementById("sign-in-btn");
  const signUpBtn = document.getElementById("sign-up-btn");

  // 회원가입 버튼 이벤트 핸들러
  if (signUpBtn) {
    signUpBtn.addEventListener("click", async () => {
      const id = document.getElementById("sign-up-id").value;
      const password = document.getElementById("sign-up-password").value;
      const errorDiv = document.getElementById("sign-up-error");

      // ID와 Password가 비어있는 경우
      if (!id || !password) {
        errorDiv.innerText = "";
        errorDiv.style.display = "none";
        showToast("ID와 Password를 입력해주세요.", true);
        return;
      }

      if (id.length < 4 || password.length < 6) {
        showToast("ID는 최소 4자, Password는 최소 6자를 입력해주세요.", true);
        return;
      }

      try {
        // 중복 ID 체크
        const memberCollection = collection(db, "members");
        const q = query(memberCollection, where("id", "==", id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          errorDiv.innerText = "이미 존재하는 ID입니다. 다른 ID를 사용해주세요.";
          errorDiv.style.display = "block";
          return;
        } else {
          errorDiv.innerText = "";
          errorDiv.style.display = "none";
        }

        // 중복 ID가 아니라면 회원가입 진행
        const docRef = await addDoc(collection(db, "members"), {
          id,
          password
        });
        console.log("Member signed up with ID:", docRef.id);
        showToast("회원가입 성공!");

      } catch (e) {
        console.error("Error during sign up:", e);
        showToast("회원가입에 실패했습니다. 다시 시도해주세요.", true);
      }
    });
  }

  // 로그인 버튼 이벤트 핸들러
  if (signInBtn) {
    signInBtn.addEventListener("click", async () => {
      const id = document.getElementById("sign-in-id").value;
      const password = document.getElementById("sign-in-password").value;

      if (id && password) {
        try {
          const memberCollection = collection(db, "members");
          const q = query(memberCollection, where("id", "==", id));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            alert("ID가 존재하지 않습니다.");
            return;
          }

          let isAuthenticated = false;
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            // 비밀번호가 같은지 확인
            if (userData.password === password) {
              isAuthenticated = true;
            }
          });

          if (isAuthenticated) {
            alert("로그인 성공!");
            sessionStorage.setItem('memberId', id);
            window.location.href = "./main.html";
          } else {
            alert("비밀번호가 올바르지 않습니다.");
          }
        } catch (e) {
          console.error("Error during sign in:", e);
          alert("로그인에 실패했습니다.");
        }
      } else {
        alert("ID와 Password를 입력해주세요.");
      }
    });
  }
});