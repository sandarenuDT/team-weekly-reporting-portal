package com.company.weeklyreports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;


@Getter
@Builder
@AllArgsConstructor
public class ChartSeriesResponse {
    private String label;
    private double value;

    public static List<ChartSeriesResponse> of(List<Object[]> rows) {
        return rows.stream()
                .map(r -> ChartSeriesResponse.builder()
                        .label(String.valueOf(r[0]))
                        .value(((Number) r[1]).doubleValue())
                        .build())
                .toList();
    }
}