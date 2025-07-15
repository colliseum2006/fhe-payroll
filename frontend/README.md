# 🔐 Confidential Payroll Frontend

A modern React frontend for the Confidential Salary Token system built with Zama FHEVM. This application demonstrates privacy-preserving payroll management using Fully Homomorphic Encryption.

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/fhe-payroll&root-directory=frontend)

### Option 2: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod

# Follow the prompts and get your live URL!
```

### Option 3: Deploy via GitHub
1. Fork this repository to your GitHub account
2. Go to [vercel.com](https://vercel.com)
3. Connect your GitHub account
4. Import your forked repository
5. Set root directory to `frontend`
6. Deploy automatically!

### Option 4: Manual Upload
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Upload your `frontend` folder
4. Deploy and get your URL!

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🌐 Other Deployment Options

### Netlify (Free)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --dir=build --prod
```

### GitHub Pages
```bash
# Add to package.json
"homepage": "https://yourusername.github.io/your-repo-name",
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## 📱 Share Your App

Once deployed, you'll get a URL like:
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`
- GitHub Pages: `https://yourusername.github.io/your-repo-name`

Share this URL with your friends! 🎉

## 🔧 Configuration

### Environment Variables

For local development, create a `.env` file in the frontend directory:

```env
# Network Configuration
REACT_APP_NETWORK=SEPOLIA

# RPC URL (replace with your Infura/Alchemy project ID)
REACT_APP_RPC_URL=https://sepolia.infura.io/v3/645b161c447c49d4bbed402076e9ad0b

# Contract Address (replace with your deployed contract address on Sepolia)
REACT_APP_CONTRACT_ADDRESS=0xf10574209A7c856887f672fAE3Eb3d5b34ED7C9c
```

### Vercel Environment Variables

When deploying to Vercel, add these environment variables in your Vercel dashboard:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add the following variables:
   - `REACT_APP_NETWORK` = `SEPOLIA`
   - `REACT_APP_RPC_URL` = `https://sepolia.infura.io/v3/645b161c447c49d4bbed402076e9ad0b`
   - `REACT_APP_CONTRACT_ADDRESS` = `0xf10574209A7c856887f672fAE3Eb3d5b34ED7C9c`

### Smart Contract Deployment

Make sure your ConfidentialFungibleToken contract is deployed to Sepolia testnet before using the application.

## 📦 Features

### 🔐 Privacy & Security
- **FHE Encryption**: All salary data encrypted using Zama FHEVM
- **Role-based Access**: Admin, HR, Payroll, and Employee roles
- **Wallet Integration**: Secure MetaMask connection
- **Confidential Operations**: Private salary management

### 💼 Business Features
- **Employee Management**: Add, remove, and update employee records
- **Payroll Processing**: Confidential salary payments and bonuses
- **Performance Tracking**: Encrypted bonus and deduction management
- **Token Transfers**: Employee-to-employee token transfers

### 🎨 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live transaction status and notifications
- **Role-based Dashboards**: Customized views for each user type
- **Modern UI**: Clean, professional interface with Tailwind CSS

### 🔧 Technical Features
- **TypeScript**: Full type safety and better development experience
- **React 18**: Latest React features and performance optimizations
- **Ethers.js**: Reliable Web3 integration
- **Zama FHEVM**: State-of-the-art privacy-preserving technology

## 🛡️ Security

This is a demonstration project showcasing FHE technology. For production use:
- ✅ Audit smart contracts thoroughly
- ✅ Review security measures and access controls
- ✅ Ensure compliance with local regulations
- ✅ Implement proper key management
- ✅ Add comprehensive logging and monitoring

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Web3**: Ethers.js, MetaMask integration
- **FHE**: Zama Relayer SDK (@zama-fhe/relayer-sdk@0.1.0)
- **Smart Contracts**: OpenZeppelin ConfidentialFungibleToken
- **Network**: Sepolia testnet
- **Build Tool**: Create React App with react-app-rewired

## 🚨 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Wallet Connection Issues:**
- Ensure MetaMask is installed and unlocked
- Switch to Sepolia testnet
- Check if the contract is deployed to Sepolia

**FHEVM Initialization Errors:**
- Check internet connection
- Ensure you're using a modern browser
- Verify environment variables are set correctly

**Deployment Issues:**
- Check that all environment variables are set in Vercel
- Verify the contract address is correct
- Ensure the RPC URL is accessible

### Getting Help

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Zama Documentation**: [docs.zama.ai](https://docs.zama.ai)
- **MetaMask Support**: [metamask.io/support](https://metamask.io/support)

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console for error messages
3. Ensure all prerequisites are met
4. Contact support with detailed error information

---

**Built with:** React, TypeScript, Tailwind CSS, Ethers.js, Zama FHEVM, OpenZeppelin 