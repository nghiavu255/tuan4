import React from "react";
import "./App.css";
import en from '@shopify/polaris/locales/en.json';
import {
  AppProvider,
} from '@shopify/polaris'
import Todo from "../Todo/Todo";
import { AppLayout } from "../Layout/AppLayout";

function App() {
  return (
    <AppProvider
      theme={{
        logo: {
          width: 124,
          topBarSource:
            'https://scontent.xx.fbcdn.net/v/t1.15752-9/262512754_323583939341000_4006884413164708631_n.png?_nc_cat=105&ccb=1-5&_nc_sid=aee45a&_nc_ohc=zA5pC74KwEgAX-24XPK&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=53f93e4516bc5650f4fa39f375766b58&oe=61D028CE',
          url: 'http://google.com',
          accessibilityLabel: 'AVADA',
        },
      }}
      i18n={en} >
      <AppLayout>
        <Todo />
      </AppLayout>
    </AppProvider>

  );
}

export default App;