package com.finplanner.service;

import com.finplanner.model.CfpClientPortfolioAssets;
import com.finplanner.repository.CfpClientPortfolioAssetsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class PortfolioService {

    @Autowired
    private CfpClientPortfolioAssetsRepository portfolioAssetsRepository;

    public PortfolioSummary calculatePortfolioSummary(Integer clientId) {
        List<CfpClientPortfolioAssets> assets = portfolioAssetsRepository.findById_ClientId(clientId);

        BigDecimal totalInvestAmount = BigDecimal.ZERO;
        BigDecimal weightedReturnSum = BigDecimal.ZERO;

        for (CfpClientPortfolioAssets asset : assets) {
            totalInvestAmount = totalInvestAmount.add(BigDecimal.valueOf(asset.getInvestAmount()));
        }

        for (CfpClientPortfolioAssets asset : assets) {
            BigDecimal investAmount = BigDecimal.valueOf(asset.getInvestAmount());
            BigDecimal yearlyReturn = BigDecimal.valueOf(asset.getYearlyReturn());

            // Calculate weighted return for this asset
            BigDecimal weightedReturn = investAmount.divide(totalInvestAmount, 4, RoundingMode.HALF_UP)
                    .multiply(yearlyReturn);
            weightedReturnSum = weightedReturnSum.add(weightedReturn);
        }

        // Round totalInvestAmount to 2 decimal places
        totalInvestAmount = totalInvestAmount.setScale(2, RoundingMode.HALF_UP);
        // Round weightedReturnSum to 4 decimal places
        weightedReturnSum = weightedReturnSum.setScale(4, RoundingMode.HALF_UP);

        return new PortfolioSummary(totalInvestAmount, weightedReturnSum);
    }

    public static class PortfolioSummary {
        private BigDecimal totalInvestAmount;
        private BigDecimal portfolioReturn;

        public PortfolioSummary(BigDecimal totalInvestAmount, BigDecimal portfolioReturn) {
            this.totalInvestAmount = totalInvestAmount;
            this.portfolioReturn = portfolioReturn;
        }

        public BigDecimal getTotalInvestAmount() {
            return totalInvestAmount;
        }

        public BigDecimal getPortfolioReturn() {
            return portfolioReturn;
        }
    }
}
