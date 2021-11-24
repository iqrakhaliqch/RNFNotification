package com.rnfnotification;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "RNFNotification";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // SplashScreen.show(this);
    super.onCreate(savedInstanceState);
  }
}
