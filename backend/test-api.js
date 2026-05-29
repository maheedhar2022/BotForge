// End-to-End API Integration Testing Script for OmniChat SaaS
import { strict as assert } from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🏁 Starting End-to-End API Integration Tests...');

  const testEmail = `test_${Math.random().toString(36).substring(2, 7)}@saas.com`;
  const testPassword = 'testpassword123';
  let token = '';
  let chatbotId = '';

  try {
    // 1. Test registration
    console.log('👉 Testing /auth/register...');
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Business Owner',
        email: testEmail,
        password: testPassword,
        businessName: 'Coffee & Code Cafe',
        businessType: 'Restaurant/Cafe'
      })
    });

    const registerData = await registerRes.json();
    assert.equal(registerRes.status, 201, 'Registration status should be 201 Created');
    assert.ok(registerData.token, 'Should return JWT token');
    token = registerData.token;
    console.log('✅ Registration success!');

    // 2. Test login
    console.log('👉 Testing /auth/login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    const loginData = await loginRes.json();
    assert.equal(loginRes.status, 200, 'Login status should be 200 OK');
    assert.ok(loginData.token, 'Should return JWT token on login');
    console.log('✅ Login success!');

    // 3. Test profile & retrieve chatbot ID
    console.log('👉 Testing /auth/profile...');
    const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const profileData = await profileRes.json();
    assert.equal(profileRes.status, 200, 'Profile status should be 200 OK');
    assert.equal(profileData.business.name, 'Coffee & Code Cafe', 'Should match company profile name');
    assert.ok(profileData.chatbot.id, 'Should contain provisioned chatbot profile');
    chatbotId = profileData.chatbot.id;
    console.log('✅ Profile retrieval success!');

    // 4. Test adding manual FAQ
    console.log('👉 Testing /upload-faq indexing...');
    const faqRes = await fetch(`${BASE_URL}/upload-faq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        question: 'Do you offer vegan options?',
        answer: 'Yes! We offer a full range of organic oat milk lattes, vegan croissants, and plant-based breakfast wraps.'
      })
    });

    const faqData = await faqRes.json();
    assert.equal(faqRes.status, 201, 'FAQ creation status should be 201');
    assert.ok(faqData.document.id, 'Should return created document node ID');
    console.log('✅ FAQ indexing success!');

    // 5. Test public chatbot config fetch
    console.log('👉 Testing /public/chatbot/:id configuration...');
    const publicRes = await fetch(`${BASE_URL}/public/chatbot/${chatbotId}`);
    const publicData = await publicRes.json();
    assert.equal(publicRes.status, 200, 'Public configuration retrieval should be 200 OK');
    assert.equal(publicData.bot_name, 'AI Assistant', 'Should match default bot name');
    console.log('✅ Public configurations check success!');

    // 6. Test conversational chat flow
    console.log('👉 Testing visitor /chat RAG matching...');
    const chatRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatbotId: chatbotId,
        visitorId: 'test_visitor_uuid',
        message: 'Do you have vegan croissants?'
      })
    });

    const chatData = await chatRes.json();
    assert.equal(chatRes.status, 200, 'Chat status should be 200 OK');
    assert.ok(chatData.reply, 'Should return conversational dialogue answer');
    assert.ok(chatData.reply.toLowerCase().includes('vegan'), 'Response should be semantically matching vegan context');
    console.log('✅ Chat dialog flow success!');

    // 7. Test visitor lead capturing card
    console.log('👉 Testing /lead contact capture...');
    const leadRes = await fetch(`${BASE_URL}/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatbotId: chatbotId,
        name: 'Jane Customer',
        email: 'jane@inbox.com',
        phone: '+1 (555) 902-1234',
        message: 'Collected during dialogue.'
      })
    });

    const leadData = await leadRes.json();
    assert.equal(leadRes.status, 201, 'Lead creation status should be 201 Created');
    assert.ok(leadData.leadId, 'Should return captured lead index ID');
    console.log('✅ Lead capturing success!');

    console.log('\n🎉 ALL INTEGRATION TESTS PASSED GLORIOUSLY! 🌟');
  } catch (error) {
    console.error('\n❌ Test execution failed with error:', error.message);
    process.exit(1);
  }
}

runTests();
