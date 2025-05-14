var readSMS=0;
if ('OTPCredential' in window) {
  //  console.log('in windw');
   window.addEventListener('DOMContentLoaded', e => {
    //  console.log('in event');
     const input = document.querySelector('input[autocomplete="one-time-code"]');
     if (!input) return;
     const ac = new AbortController();
     const form = input.closest('form');
     if (form) {
       form.addEventListener('submit', e => {
         ac.abort();
       });
     }
     if(readSMS==1){
        navigator.credentials.get({
       signal: ac.signal,
       otp: { transport:['sms'] },
     }).then(otp => {
        ac.abort();
       input.value = otp.code;
       console.log('Otp Valid Call');
       validateOTP(pId);
       // if (form) form.submit();
       
     }).catch(err => {
       console.log(err);
     });
   }  
  
 });
}